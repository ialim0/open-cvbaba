import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from types import SimpleNamespace

from app.services.chat.langgraph_pipeline import (
    IntentData,
    LayoutPlanData,
    ValidationResult,
    DocumentGraphState,
    validate_html_node,
    error_retry_node,
    render_to_pdf_node,
    decide_next_step,
    create_document_generation_graph,
    parse_intent_node,
    plan_layout_node,
    generate_code_node,
    generate_document_with_langgraph,
)


def test_validation_node_valid_html():
    valid_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4; margin: 0; }
    .pdf-page { width: 210mm; min-height: 297mm; padding: 15mm; }
  </style>
</head>
<body>
  <div class="pdf-page">
    <h1>John Doe</h1>
    <p>Software Engineer</p>
  </div>
</body>
</html>"""

    state: DocumentGraphState = {
        "generated_code": valid_html,
        "retry_count": 0,
        "max_retries": 3
    }

    result = asyncio.run(validate_html_node(state))
    val = result["validation_result"]

    assert val["is_valid"] is True
    assert len(val["errors"]) == 0
    assert val["page_count"] == 1
    assert result["status"] == "validated"


def test_validation_node_invalid_html_missing_page():
    invalid_html = """<!DOCTYPE html>
<html>
<head><style></style></head>
<body>
  <div>Just a regular div, no pdf-page container</div>
</body>
</html>"""

    state: DocumentGraphState = {
        "generated_code": invalid_html,
        "retry_count": 0,
        "max_retries": 3
    }

    result = asyncio.run(validate_html_node(state))
    val = result["validation_result"]

    assert val["is_valid"] is False
    assert any("pdf-page" in err for err in val["errors"])
    assert result["status"] == "validation_failed"


def test_validation_node_empty_html():
    state: DocumentGraphState = {
        "generated_code": "",
        "retry_count": 0,
        "max_retries": 3
    }

    result = asyncio.run(validate_html_node(state))
    val = result["validation_result"]

    assert val["is_valid"] is False
    assert len(val["errors"]) > 0
    assert result["status"] == "validation_failed"


def test_error_retry_node():
    state: DocumentGraphState = {
        "validation_result": {
            "is_valid": False,
            "errors": ["Missing .pdf-page wrapper", "Unclosed <body> tag"],
            "warnings": [],
            "page_count": 0
        },
        "retry_count": 1,
        "max_retries": 3
    }

    result = asyncio.run(error_retry_node(state))

    assert result["retry_count"] == 2
    assert result["status"] == "retrying"
    assert "Missing .pdf-page wrapper" in result["error_feedback"]
    assert "Unclosed <body> tag" in result["error_feedback"]


def test_decide_next_step_routing():
    # 1. Valid state -> render_to_pdf
    valid_state: DocumentGraphState = {
        "validation_result": {"is_valid": True, "errors": []},
        "retry_count": 0,
        "max_retries": 3
    }
    assert decide_next_step(valid_state) == "render_to_pdf"

    # 2. Invalid state with retries available -> error_retry
    retry_state: DocumentGraphState = {
        "validation_result": {"is_valid": False, "errors": ["Syntax error"]},
        "retry_count": 1,
        "max_retries": 3
    }
    assert decide_next_step(retry_state) == "error_retry"

    # 3. Invalid state with max retries exceeded -> render_to_pdf (fallback)
    max_retries_state: DocumentGraphState = {
        "validation_result": {"is_valid": False, "errors": ["Syntax error"]},
        "retry_count": 3,
        "max_retries": 3
    }
    assert decide_next_step(max_retries_state) == "render_to_pdf"


def test_render_to_pdf_node():
    raw_html = """<div class="pdf-page"><h1>Document Title</h1><p>Test content</p></div>"""
    state: DocumentGraphState = {
        "generated_code": raw_html
    }

    result = asyncio.run(render_to_pdf_node(state))
    final_html = result["final_html"]

    assert "<!DOCTYPE html>" in final_html
    assert '<div class="pdf-page">' in final_html
    assert result["status"] == "completed"


def test_graph_compilation():
    graph = create_document_generation_graph()
    assert graph is not None


@pytest.mark.asyncio
async def test_full_langgraph_pipeline_execution():
    fake_intent_json = '{"document_type": "cv", "language": "en", "target_audience": "Tech", "tone": "Professional", "key_sections": ["Summary", "Experience"], "key_highlights": ["Built AI apps"], "formatting_requirements": []}'
    fake_layout_json = '{"page_count": 1, "color_palette": {"primary": "#000"}, "typography": {"body_font": "Inter"}, "page_structure": [], "layout_system": "single-column"}'
    fake_html = '<!DOCTYPE html><html><head><style>@page{size:A4;margin:0;}</style></head><body><div class="pdf-page"><h1>Jane Doe</h1></div></body></html>'

    mock_client = MagicMock()
    mock_client.models.generate_content = AsyncMock(side_effect=[
        SimpleNamespace(text=fake_intent_json),   # parse_intent (Mistral Large)
        SimpleNamespace(text=fake_layout_json),   # plan_layout (Mistral Large)
        SimpleNamespace(text=fake_html),          # generate_code (Codestral)
    ])

    with patch("app.services.chat.langgraph_pipeline._get_mistral_client", return_value=mock_client):
        output = await generate_document_with_langgraph(
            user_input="Create a CV for a Senior Python Developer",
            document_type="cv",
            language="en",
            num_pages=1
        )

        assert "<!DOCTYPE html>" in output
        assert '<div class="pdf-page">' in output
        assert "Jane Doe" in output
