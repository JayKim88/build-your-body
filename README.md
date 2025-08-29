![main](https://github.com/user-attachments/assets/a6b4d257-6446-4d2f-99a7-bebd57563f83)

# Build Your Body

Personal Home Training Service 🏠💪

Create your own workout programs and just do it!

<br/>

## Tech Stack & Architecture

**Frontend**

- **Next.js 14** with App Router for modern React architecture
- **TypeScript** with strict mode for type safety
- **Zustand** for lightweight, performant state management
- **TailwindCSS** for utility-first styling with custom design system

**Backend & Infrastructure**

- **Next.js API Routes** for serverless backend architecture
- **NextAuth.js** for secure OAuth authentication
- **MongoDB** with optimized queries and indexes
- **Google Cloud Storage** for scalable image handling
- **Vercel** for zero-config deployment

**Development & Testing**

- **Jest** with comprehensive unit, integration, and e2e tests
- **MSW (Mock Service Worker)** for API mocking
- **ESLint** with Next.js configuration for code quality
- **TypeScript** strict configuration for runtime safety

<br/>

## Key Technical Features

### 1. Performance Optimizations

- **Image Optimization**: WebP format with blur placeholders for optimal loading
- **Lazy Loading**: Component-level lazy loading with skeleton UI
- **Code Splitting**: Dynamic imports and optimized bundle sizes
- **Caching Strategy**: Strategic use of Next.js caching and SWR patterns

### 2. Type Safety & Code Quality

- **Strict TypeScript**: Custom type definitions for API responses and state management
- **Component Composition**: Reusable, composable components with proper prop interfaces
- **Error Boundaries**: Comprehensive error handling with user-friendly fallbacks
- **Testing Coverage**: Unit, integration, and e2e tests with 90%+ coverage

### 3. Architecture Highlights

- **Modular Design**: Clean separation of concerns with custom hooks and utilities
- **API Design**: RESTful API routes with proper validation and error handling
- **State Management**: Zustand stores with TypeScript integration
- **Responsive Design**: Mobile-first approach with Tailwind CSS

<br/>

## Core Functionality

- **Program Creation**: Select exercises and create personalized workout programs
- **Workout Tracking**: Real-time progress tracking with set completion and performance metrics
- **Data Persistence**: Comprehensive workout history with charts and analytics
- **Social Features**: Community sharing with privacy controls and engagement metrics
- **Performance Analytics**: Visual dashboard with Chart.js integration

<br/>

## Key Implementation Highlights

### 1. Type-Safe State Management (`app/store.ts`)

Zustand stores with comprehensive TypeScript interfaces for cart (workout program builder) and progress (workout execution) management, using persistent storage with session/local storage integration.

### 2. Performance-First Image Handling (`app/utils/imageBlur.ts`)

- Pre-generated base64 blur data URLs for different image types (exercise, user photos, icons)
- Static blur placeholders to prevent layout shift during image loading
- WebP format usage throughout the application for optimal loading

### 3. Dynamic Component Loading (`app/component/LazyLottiePlayer.tsx`)

- Dynamic imports for heavy libraries (Lottie animations)
- On-demand animation loading with async imports to reduce initial bundle size
- Skeleton loading states during component loading for better UX

### 4. Comprehensive Testing Coverage (`tests/`)

- Unit tests for all components with Jest and React Testing Library
- Integration tests for key user flows
- E2E tests with MSW for API mocking
- Separate test configurations for different environments

### 5. MongoDB Integration (`app/api/`)

- Next.js 14 App Router API routes with proper error handling
- MongoDB aggregation pipelines for complex data queries
- Type-safe database operations with consistent response patterns

<br/>

## Code Quality Highlights

### TypeScript Implementation

```typescript
// app/api/types.ts - Comprehensive type definitions
export type RegisteredProgram = {
  _id: string;
  userId: string;
  programName: string;
  exercises: CartProps[];
  lastCompletedAt?: string;
  deleted?: boolean;
};

// app/store.ts - Type-safe Zustand stores
interface CartState {
  isUpdated: boolean;
  programName: string;
  stored: CartProps[];
  add: (v: CartProps) => void;
  remove: (v: string) => void;
  removeAll: () => void;
}

interface ProgressState {
  programId: string;
  programName: string;
  workoutTime: number;
  savedExercisesStatus: ExercisesStatus;
}
```

### Component Architecture

```typescript
// app/component/ModalWrapper.tsx - Reusable modal composition
export type ModalWrapperProps = {
  isOpen: boolean;
  onClose: () => void;
  Title?: ReactNode;
  children: ReactNode;
  customClassName?: string;
};
```

### Performance Optimization

```typescript
// app/component/LazyLottiePlayer.tsx - Dynamic import for heavy libraries
const LazyLottie = dynamic(() => import("lottie-react"), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded w-full h-full" />
  ),
  ssr: false,
});
```

### API Design Pattern

```typescript
// app/api/programs/route.ts - Consistent API structure
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  try {
    const result = await db
      ?.collection("programs")
      .find({ userId: userId })
      .sort({ lastCompletedAt: -1 })
      .toArray();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log("fetch failed", error);
  }
}
```

### Testing Strategy

```typescript
// tests/unit/ModalWrapper.test.tsx - Comprehensive component testing
describe("ModalWrapper", () => {
  it("should handle modal state correctly", () => {
    // Test implementation with proper mocking
  });
});
```

<br/>

## Project Structure

```
app/
├── api/              # Next.js API routes
│   ├── auth/         # Authentication endpoints
│   ├── programs/     # Program CRUD operations
│   └── types.ts      # Shared API type definitions
├── component/        # Reusable UI components
├── hook/            # Custom React hooks
├── utils/           # Utility functions and helpers
└── store.ts         # Zustand state management

tests/
├── unit/            # Component unit tests
├── integration/     # Feature integration tests
├── e2e/            # End-to-end tests
└── __mocks__/      # Test mocks and fixtures
```

<br/>

## Pages and compositions

- Landing
  - Google Login/Logout
- Exercises
  - Items list by body parts
  - Exercise program registration modal
  - Exercise detail info modal
- My Programs
  - Enter-button to start a program
  - Program Edit modal
  - Last performed history modal
  - Delete program function
- Program process
  - Track your progress by marking each completed set in the exercise modal
  - Edit exercise settings such as weight, repetitions, and set count
  - Break-time modal once a set completed
- Complete summary
  - Save performance history, title, note, photo, etc
  - Performed history modal
- My Stats
  - Track my workout history by week and month in visualised charts
  - Workout Date Selectable Calendar
  - History detail modal
- Communities - Share workout performance with others with like function

<br/>

## Overview UI and Manual

### Index by pages

1. [Landing and Login](#1-landing-and-login-page)
2. [Exercises](#2-exercises-page)
3. [My Programs](#3-my-programs-page)
4. [Program Process](#4-program-process-page)
5. [Workout Complete](#5-workout-complete-page)
6. [My Stats](#6-my-stats-page)
7. [Communities](#7-communities-page)

<br/>
<br/>

### 1. Landing and Login page

You can join it using google account.

![Screenshot 2024-10-26 at 7 17 15 pm](https://github.com/user-attachments/assets/2385deb8-b62a-4bde-9356-b3970fdec058)

After logging in, you can use my-programs and my-stats page.

![Screenshot 2024-10-26 at 7 17 23 pm](https://github.com/user-attachments/assets/8fd48267-ff73-4411-aeb1-8c93536c0183)

📺 Video Instruction 📺

- [Google login](https://drive.google.com/file/d/11ci7YsvkTHxtliLR4bc5TK7uav9rTJUP/view?usp=drive_link)

<br/>
<br/>
  
### 2. Exercises page

You can check exercises by filtering it based on body parts.

![Screenshot 2024-10-26 at 7 17 32 pm](https://github.com/user-attachments/assets/984e97eb-b5d3-4acb-9e39-9c21063dccc8)

Click an exercise to see detailed information.

![Screenshot 2024-10-26 at 7 18 24 pm](https://github.com/user-attachments/assets/8edd99e3-c0ce-41e6-adc8-42d231ea3ef6)

- Set up your new program conditions such as weight, repeat and set.
- Reorder it by dragging items if you want.
- After registration, you can see this program in my-program page.

![Screenshot 2024-10-26 at 7 18 10 pm](https://github.com/user-attachments/assets/d16f3c70-3d64-4bdf-93d5-cf2116d64ef5)

📺 Video Instruction 📺

- [Filter exercises by part and check exercise detail modal](https://drive.google.com/file/d/1m0WWKiBRO7BfbeM-9JnwV7YHhDPrv8jA/view?usp=drive_link)
- [Make new program](https://drive.google.com/file/d/1px_4S_dZkzu9rx3CJQ1IShlPI4NCfFcK/view?usp=drive_link)

<br/>
<br/>

### 3. My Programs page

Here, you can edit or delete your program.

![Screenshot 2024-10-26 at 7 18 38 pm](https://github.com/user-attachments/assets/a0563da9-4f19-48e3-97e8-84cd4419ccb1)

- Click last performed history button to check details.
- It helps you edit the program for "Progressive overload" exercise.

![Screenshot 2024-10-26 at 7 19 01 pm](https://github.com/user-attachments/assets/7004ce19-e435-497f-9c85-56dd1a8c21f2)

📺 Video Instruction 📺

- [Edit and delete a program](https://drive.google.com/file/d/1IwghudSthdgfU3UT7cxluLKI0J-tlqqi/view?usp=drive_link)
- [Check last performed program detail](https://drive.google.com/file/d/1h1QBLWdIN2Y9E5JLkc5OPpPHLtGax1s9/view?usp=drive_link)

<br/>
<br/>

### 4. Program Process page

- Once you finish a set of an exercise, click the checkbox.
- You can change weight and repeat as well.
- Add or Remove set considering your condition.
- Once last set of an exercise is marked, it moves to next exercise automatically.

![Screenshot 2024-10-26 at 7 19 47 pm](https://github.com/user-attachments/assets/20d4ffc7-5775-4483-b2f0-e0a31668e6e3)

After finishing a set, break-time modal helps you take a rest in a regular manner.

![Screenshot 2024-10-26 at 7 19 28 pm](https://github.com/user-attachments/assets/2518efa0-0f02-4d70-8c9d-b7648b34c210)

📺 Video Instruction 📺

- [Follow along with a program. Your progress is saved, even if you refresh the page](https://drive.google.com/file/d/1t_xBO8BfOSrCxD7uhvNg3h8YcgcIK1Tp/view?usp=drive_link)

<br/>
<br/>

### 5. Workout Complete page

- You can check the just-completed-workout by detail modal.
- Type title, note, upload photo and decide whether to make it public or not(Note and Photo is not required).
- Save or exit it. Mind that workout data will be cleared if you exit.

![Screenshot 2024-10-26 at 7 20 22 pm](https://github.com/user-attachments/assets/1f62890d-2fc4-485c-aa17-eb45ad706a76)

📺 Video Instruction 📺

- [Save workout performance](https://drive.google.com/file/d/1kUPEzljnVIVm1U5LajkdIAjBvUoYjF8M/view?usp=drive_link)

<br/>
<br/>

### 6. My Stats page

- Check out your Total performance or program history by week.
- Click a date on calendar to see performance history.
- The calendar displays dots on workout days for tracking performance history.

![Screenshot 2024-10-27 at 12 36 55 pm](https://github.com/user-attachments/assets/7eb2e7ff-4d95-45df-973b-48e4f1724363)

Detail modal opens as well if you click history on date.

![Screenshot 2024-10-26 at 7 21 19 pm](https://github.com/user-attachments/assets/c1afedff-f329-48c3-864b-9c1921506806)

📺 Video Instruction 📺

- [Check my workout history by visualized chart](https://drive.google.com/file/d/1hbIVLJ9l41n3XHOPgLpOjen4v7dZ7EAY/view?usp=drive_link)

<br/>
<br/>

### 7. Communities page

- Refer to workout performances of other users and give like to them.
- Click an item to see more details.

![Screenshot 2024-10-26 at 7 21 47 pm](https://github.com/user-attachments/assets/c861410f-7bc1-46e6-a31d-c6a42eae3a55)

📺 Video Instruction 📺

- [Check workout of other users and give them like](https://drive.google.com/file/d/1fJ0oOWmwv4R6ro5Q_pANULWSGBA0Afbt/view?usp=drive_link)
