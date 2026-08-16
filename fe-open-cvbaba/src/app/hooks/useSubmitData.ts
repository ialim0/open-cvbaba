import axios from "axios";

export const submitData = async (slug: string | null, data: Record<string, any> | FormData, template_id?: string) => {
  const url = slug
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/${slug}`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat`;

  const method = slug ? "patch" : "post";
  const isMultipart = data instanceof FormData;

  // Include templateId in the data if it is provided
  if (template_id) {
    if (isMultipart) {
      // Check if already appended to avoid duplication if called multiple times (though unlikely)
      if (!(data as FormData).has('template_id')) {
        (data as FormData).append('template_id', template_id);
      }
    } else {
      (data as Record<string, any>).template_id = template_id;
    }
  }

  console.log("submitData called with:", { slug, dataIsMultipart: isMultipart, template_id });

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (!isMultipart) {
      headers["Content-Type"] = "application/json";
    }

    const response = await axios({
      method,
      url,
      data,
      headers,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error in submitData:", error);
    throw error;
  }
};
