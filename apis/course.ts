import { API_BASE_URL } from "~/constants/common"
import { CourseResponse } from "types/api/course"

/** 動画一覧取得 */
export const fetchCourses = async (): // data: VideoRequest
Promise<CourseResponse[] | undefined> => {
  const response = await $fetch<CourseResponse[]>(`${API_BASE_URL}/courses2`)
  if (!response) return

  return response
}

export const fetchCourseDetail = async (
  currentCourseCode: number
): // data: VideoRequest
Promise<CourseResponse | undefined> => {
  const response = await $fetch<CourseResponse>(
    `${API_BASE_URL}/course/${currentCourseCode}`
  )
  if (!response) return

  return response
}
