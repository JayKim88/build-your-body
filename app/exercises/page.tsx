"use server";

import Link from "next/link";

import { SearchInput } from "../component/SearchInput";
import { getExercisesList } from "../api/exercises/getData";
import { FilteredList } from "./FilteredList";
import { Exercise } from "../api/types";
import { ExerciseType } from "../component/Filter";

export default async function Page() {
  // const fetchedData = await getExercisesList();
  // console.dir(fetchedData, { depth: null });

  return (
    <div className="h-fit w-screen relative bg-black flex-col pt-[20px] px-[80px]">
      <section className="flex">
        <div className="flex gap-8">
          <Link href="/">
            <h1 className="text-[80px] text-stroke-4 text-stroke-black font-semibold">
              Build Your Body
            </h1>
          </Link>
          <SearchInput />
        </div>
      </section>
      <FilteredList data={mockData} />
    </div>
  );
}

/**
 * @description demo data for dev. too many requests to mongodb
 */
const mockData: Exercise[] = [
  {
    _id: "669b7af39ea15883e6c46b27",
    type: "chest" as ExerciseType,
    name: "Bench Press",
    summary:
      "대흉근(가슴의 앞쪽과 위쪽을 광범위하게 덮는 큰 부채꼴 모양의 근육)과 소흉근(갈비뼈와 날개뼈를 이어주는 근육)을 단련합니다.",
    guide: [
      "준비 자세: 어깨 너비로 바벨을 잡고, 가슴을 펴고 허리를 아치형으로 유지합니다.",
      "내리기: 바벨을 천천히 내리면서 팔꿈치를 45도 각도로 굽혀 가슴 중앙까지 내립니다.",
      "밀어 올리기: 바벨을 밀어 올리며 팔을 완전히 펴지 않고 약간 구부린 상태로 유지합니다.",
    ],
    thumbnail_img_url:
      "https://drive.google.com/uc?export=view&id=1SWNaJ7Wa7L6Kbnkt19jMVYliiJ2MxgmJ",
    ref: [
      {
        title: "[SBD] 벤치 프레스 (Bench Press)",
        url: "https://yeonghyeonko.github.io/SBD-Benchpress/",
      },
      {
        title: "[운동 설명] 벤치 프레스 (Bench Press) 하는 법",
        url: "https://my-life-pattern-jws.tistory.com/46",
      },
    ],
    description:
      "벤치프레스는 바벨이나 덤벨을 사용해 벤치에 누워서 중량을 들어 올리는 운동으로, 주로 대흉근, 삼두근, 삼각근을 강화합니다. 이 운동은 상체 근력을 크게 향상시키며, 가슴 근육의 발달과 함께 팔과 어깨 근육도 발달시킵니다. 적절한 자세와 무게를 유지하면 부상 위험을 줄일 수 있습니다. 벤치프레스는 다양한 변형 운동을 통해 상부와 하부 가슴 근육을 집중적으로 자극할 수 있습니다. 꾸준히 연습하면 전체적인 상체 근력과 체형 개선에 효과적입니다.",
    video_url: "https://www.youtube.com/embed/4Y2ZdHCOXok?si=qm8ddWvGyqe9acpt",
  },
  {
    _id: "669b7bf59ea15883e6c46b28",
    type: "leg" as ExerciseType,
    name: "Squat",
    summary:
      "하체 근육을 강화하고 전신 근력과 안정성을 향상시키는 매우 효과적인 운동. 대퇴사두근, 대둔근, 그리고 햄스트링을 단련합니다.",
    guide: [
      "준비 자세: 어깨 너비로 발을 벌리고 발끝을 약간 바깥쪽으로 한 후 허리를 곧게 세웁니다.",
      "내리기: 엉덩이를 뒤로 빼며 무릎을 굽혀 허벅지가 바닥과 평행할 때까지 앉습니다.",
      "일어나기: 발뒤꿈치를 눌러 일어나며 엉덩이를 조이고 시작 자세로 돌아갑니다.",
    ],
    thumbnail_img_url:
      "https://drive.google.com/uc?export=view&id=1PHE2V1xEk4kxjWYtHDDcxPz4-fs2zNpx",
    ref: [
      {
        title: "올바른 방법으로 스쿼트(Squat)를 해보자.",
        url: "https://m.blog.naver.com/heirowind/220755968130",
      },
      {
        title: "스쿼트 운동 제대로 하는 법 4",
        url: "https://kormedi.com/1352535/%EC%8A%A4%EC%BF%BC%ED%8A%B8-%EC%9A%B4%EB%8F%99-%EC%A0%9C%EB%8C%80%EB%A1%9C-%ED%95%98%EB%8A%94-%EB%B2%95-4/",
      },
    ],
    description:
      "스쿼트는 하체 근육을 강화하고 전신의 균형과 안정성을 향상시키는 매우 효과적인 운동입니다. 발을 어깨 너비로 벌리고 가슴을 펴고 허리를 곧게 세운 상태에서 엉덩이를 뒤로 빼며 무릎을 굽혀 앉았다가, 발뒤꿈치를 눌러 일어나며 시작 자세로 돌아갑니다. 대퇴사두근, 대둔근, 그리고 햄스트링을 주로 강화하며, 운동 능력과 일상 생활에서의 수행 능력을 향상시킵니다. 꾸준히 연습하면 전신 근력과 체형 개선에 큰 도움이 됩니다.",
    video_url: "https://www.youtube.com/embed/gcNh17Ckjgg?si=y5w_2mM4k8f7C8Zq",
  },
  {
    _id: "669b872a9ea15883e6c46b29",
    type: "back" as ExerciseType,
    name: "pull up",
    summary:
      "풀업은 철봉을 잡고 몸을 위로 당겨 올려 턱이 철봉 위로 올라가게 하는 운동으로, 주로 광배근과 이두근을 강화합니다.",
    guide: [
      "준비 자세: 철봉을 어깨 너비보다 약간 넓게 잡고, 팔을 완전히 펴고 몸을 늘어뜨립니다.",
      "당겨 올리기: 등 근육을 사용해 몸을 위로 당겨 턱이 철봉 위로 올라올 때까지 끌어올립니다.",
      "내리기: 천천히 몸을 내리면서 팔을 완전히 펴고 시작 자세로 돌아갑니다.\n",
    ],
    thumbnail_img_url:
      "https://drive.google.com/uc?export=view&id=1Y2Ja3Slp4GfrxjqcFgY5GAEHOWsn4XOk",
    ref: [
      {
        title: "턱걸이&풀업 제대로 하는 방법과 효과 + 팁",
        url: "https://post.naver.com/viewer/postView.naver?volumeNo=5199361&memberNo=30789264",
      },
      {
        title: "턱걸이를 하는 방법과 이유",
        url: "https://www.nike.com/kr/a/how-and-why-to-do-a-pull-up",
      },
    ],
    description:
      "풀업은 상체와 등 근육을 강화하는 효과적인 운동으로, 철봉을 잡고 몸을 위로 당겨 올리는 동작을 포함합니다. 주로 광배근, 이두근, 상완근을 타겟으로 하며, 코어 근육의 안정성도 향상시킵니다. 체중을 이용해 근력을 키울 수 있어 별도의 장비가 필요하지 않으며, 전신 근력 향상에 큰 도움을 줍니다. 꾸준히 연습하면 상체와 등의 강한 근육과 균형 잡힌 체형을 만들 수 있습니다.\n",
    video_url: "https://www.youtube.com/embed/eGo4IYlbE5g?si=CfmQsxBna1_fzsJ6",
  },
  {
    _id: "669b87429ea15883e6c46b2a",
    type: "shoulder" as ExerciseType,
    name: "shoulder press",
    summary:
      "덤벨이나 바벨을 사용해 머리 위로 무게를 들어 올려 주로 삼각근과 삼두근을 강화하는 운동입니다. ",
    guide: [
      "준비 자세: 덤벨이나 바벨을 어깨 높이로 들고, 발은 어깨 너비로 벌리고 허리를 곧게 펍니다.",
      "밀어 올리기: 어깨와 팔 근육을 사용해 덤벨이나 바벨을 머리 위로 올려 팔을 완전히 펍니다.",
      "내리기: 천천히 덤벨이나 바벨을 시작 위치인 어깨 높이로 내리며 원래 자세로 돌아갑니다.",
    ],
    thumbnail_img_url:
      "https://drive.google.com/uc?export=view&id=1n3ZXG3K9xpH31dN7aQP4pPo5bvngpB2P",
    ref: [
      {
        title: "덤벨 숄더 프레스 각진 어깨를 원한다면 반드시",
        url: "https://blog.naver.com/chingyangn/221222730659",
      },
      {
        title: "덤벨숄더프레스의 자세 및 주의점",
        url: "https://shallwe-health.tistory.com/entry/%EB%8D%A4%EB%B2%A8%EC%88%84%EB%8D%94%ED%94%84%EB%A0%88%EC%8A%A4%EC%9D%98-%EC%9E%90%EC%84%B8-%EB%B0%8F-%EC%A3%BC%EC%9D%98-%EC%A0%90",
      },
    ],
    description:
      "숄더 프레스는 어깨 근육을 강화하는 대표적인 운동으로, 주로 삼각근과 삼두근을 타겟으로 합니다. 이 운동은 덤벨이나 바벨을 사용하여 머리 위로 무게를 들어 올리는 동작으로 이루어집니다. 올바른 자세를 유지하면 어깨 근육의 발달과 함께 상체의 안정성도 향상됩니다. 꾸준히 수행하면 어깨와 팔의 근력과 체형을 개선하는 데 큰 도움이 됩니다.",
    video_url: "https://www.youtube.com/embed/V0dYd1jyLpE?si=Z-UBEnOZ2c1gNQg7",
  },
  {
    _id: "669b87519ea15883e6c46b2b",
    type: "arm" as ExerciseType,
    name: "Barbell Curl",
    summary:
      "바벨 컬은 이두근을 강화하는 기본적인 운동으로, 바벨을 들어 올리고 내리는 동작을 통해 팔의 근력과 크기를 증가시킵니다.",
    guide: [
      "준비 자세: 어깨 너비로 발을 벌리고 서서, 바벨을 어깨 너비로 잡고 손바닥이 앞을 보게 합니다.",
      "바벨 들어 올리기: 팔꿈치를 고정하고 이두근을 수축시켜 바벨을 어깨 높이까지 들어 올립니다.",
      "바벨 내리기: 천천히 바벨을 원래 위치로 내리며 팔꿈치를 완전히 펴지 않도록 주의합니다.",
    ],
    thumbnail_img_url:
      "https://drive.google.com/uc?export=view&id=1iTYhVKKE8Rb4P0EwJIFNkdmsa6KmhVkK",
    ref: [
      {
        title: "이두 운동을 배워보자 : 바벨 컬(Barbell Curl)",
        url: "https://m.blog.naver.com/sqzenny/221334697291",
      },
      {
        title: "바벨컬 자세",
        url: "https://gsole.tistory.com/entry/%EB%B0%94%EB%B2%A8%EC%BB%AC-%EC%9E%90%EC%84%B8",
      },
    ],
    description:
      "바벨 컬은 이두근을 강화하는 기본적인 상체 운동으로, 바벨을 사용해 팔을 굽혀 중량을 들어 올리는 동작을 포함합니다. 이 운동은 주로 상완 이두근과 상완근을 타겟으로 하여 팔의 근력과 크기를 증가시킵니다. 팔꿈치를 고정한 상태로 수행하여 상체의 안정성을 유지하면서 정확한 폼을 유지하는 것이 중요합니다. 꾸준히 연습하면 팔의 모양과 힘을 개선하는 데 큰 도움이 됩니다.",
    video_url: "https://www.youtube.com/embed/QZEqB6wUPxQ?si=msWDoNgPQJQ-O46Z",
  },
];
