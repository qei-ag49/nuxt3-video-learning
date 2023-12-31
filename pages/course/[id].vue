<script lang="ts" setup>
import { fetchCourseDetail } from '~/apis/course'
import { fetchVideosByCourseId } from '~/apis/video'
import { CourseResponse } from 'types/api/course'
import { VideoResponse } from 'types/api/video'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentCourseCode = ref<number>(0)

/** ここに$fetch()した結果を代入させる */
const course = ref<CourseResponse | null>(null)

/** コースに所属している動画List */
let courseVideos = ref<VideoResponse[]>([])

onMounted(async () => {
  currentCourseCode.value = Number(router.currentRoute.value.params.id)

  try {
    const response = await fetchCourseDetail(currentCourseCode.value)
    if (!response) return

    // 取得したデータをcoursesに設定
    course.value = response
    if (!course.value?.courseId) return

    const response2 = await fetchVideosByCourseId(course.value.courseId)
    if (!response2) return

    // 取得したデータを`courseVideos`に設定
    courseVideos.value = response2.videoList

  } catch (error) {
    console.log('失敗！')
    console.error(error)
  }
})

/** コース詳細から、コースの一番最初の動画の詳細ページに移動する */
const showCourseVideo = (): void => {
  if (!courseVideos || !courseVideos.value || !courseVideos.value[0]) return

  const code: number = courseVideos.value[0].videoCode
  router.push(`/video/${code}`)
}

/** コース一覧に戻る */
const moveToCourses = (): void => {
  router.push(`/courses`)
}

// コンポーネントツリーに提供する
provide('course', course)

</script>

<template>
  <section class="section">
    <div class="container">
      <div class="breadcrumb">
        <nuxt-link to="/courses" class="nav-link">コース一覧</nuxt-link> 
        &nbsp;&nbsp;>&nbsp;&nbsp;{{ course?.name }}
      </div>

      <div class="col block__course" style="position: relative;">
        <h2 class="heading__lv2">
          {{ course?.name }}
        </h2>

        <div class="block__course_detail">
          <div class="textWrapper">
            <p>{{ course?.leadSentence }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card__detail shadow-sm" style="position: absolute; top: 8rem; right: 4rem;">
      <img :src="`${course?.imageSrc}`" alt="">

      <div class="card-content">
        <!-- 学習時間
        <br> -->
        難易度：{{ course?.difficulty }}

        <div class="buttonWrapper mt-4">
          <button @click="showCourseVideo"  class="commonButton">動画を視聴する</button>
        </div>
      </div>
    </div>

  </section>

  <section class="section">
    <div class="container">
      <h3 class="heading__lv3">
        {{ course?.name }}の動画一覧
      </h3>
      <ul>
        <li v-for="(video, index) in courseVideos" :key="index" class="">
          {{ video.title }}
        </li>
      </ul>

      <div class="mt-4">
        <p>最終更新日：{{ course?.updatedAt }}</p>
      </div>

      <div class="buttonWrapper">
        <button @click="moveToCourses"  class="commonButton">コースの一覧に戻る</button>
      </div>
    </div>
  </section>

  <section class="section pb-4">
    <div class="container">
      <div class="buttonWrapper">
        <button @click="moveToCourses"  class="commonButton">コースの一覧に戻る</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section {
  color: #fff;
  padding: 2rem 0;
}

.section:first-of-type {
  min-height: 20vh;
}

.section:nth-last-of-type(2n) {
  background-color: #fff;
  color: #000;
}

.section:nth-last-of-type(2n+1) {
  background-color: #1c1d1f;
  color: #fff;
}

.heading__lv2 {
  color: #fff;
}

// 動画枠
.col.block__course {
  width: 70%;
  box-sizing: border-box;
}

// プレイヤーリスト大外
.col.block__coursePlayerList {
  width: 30%;
  box-sizing: border-box;
}

.block__coursePlayer {
  box-sizing: border-box;
}

.block__course_detail {
  box-sizing: border-box;
  max-width: 90%;
  min-height: 30vh;
  margin-top: 1rem;
}

.textWrapper {
  min-height: 10rem;
}

.d-flex {
  justify-content: flex-start !important;
}

@media (max-width: 1060px) {
  .col.block__course {
    width: 100% !important;
  }
  .col.block__coursePlayerList {
    width: 100% !important;
  }
}
</style>
