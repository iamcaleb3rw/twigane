import { sanityFetch } from "../live";
import { defineQuery } from "groq";

async function getSidebarInfoById(id: string) {
  const getSidebarInfoByIdQuery =
    defineQuery(`*[_type == "course" && _id == $id][0] {
      title,
      slug,  // Spread all course fields
      "modules": modules[]-> {  // Expand the array of module references
        title,  // Include all module fields
        "lessons": lessons[]-> {
        title, 
        slug,
        videoUrl
        }  // For each module, expand its array of lesson references
      }
    }`);

  const course = await sanityFetch({
    query: getSidebarInfoByIdQuery,
    params: { id },
  });

  // Return just the data portion of the response
  return course.data;
}

export default getSidebarInfoById;
