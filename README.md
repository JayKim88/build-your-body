![main](https://github.com/user-attachments/assets/a6b4d257-6446-4d2f-99a7-bebd57563f83)

# Build Your Body

Personal Home Training Service 🏠💪

A comprehensive workout management platform that enables users to create personalized exercise programs, track real-time progress, and share achievements with the community.

<br/>

## 🛠 Tech Stack & Architecture

**Frontend**

- **Next.js 14** with App Router for modern React architecture
- **TypeScript** with strict mode for type safety and better developer experience
- **Zustand** for lightweight, performant state management
- **TailwindCSS** for utility-first styling with responsive design

**Backend & Infrastructure**

- **Next.js API Routes** for serverless backend architecture
- **NextAuth.js** for secure OAuth authentication with Google
- **MongoDB** with optimized queries and aggregation pipelines
- **Google Cloud Storage** for scalable image handling
- **Vercel** for zero-config deployment and edge optimization

**Development & Testing**

- **Jest** with comprehensive unit, integration, and e2e tests
- **MSW (Mock Service Worker)** for reliable API mocking
- **ESLint** with Next.js configuration for code quality
- **TypeScript** strict configuration for runtime safety

<br/>

## 🚀 Core Features

**Program Creation**

- Exercise selection with drag-and-drop functionality
- Custom workout program builder with set/weight/rep configuration
- Exercise filtering by muscle groups (chest, back, legs, shoulders, arms)

**Workout Execution**

- Real-time progress tracking with interactive UI
- Set completion with performance metrics calculation
- Break timer with customizable rest periods

**Data Analytics**

- Comprehensive workout history with Chart.js visualizations
- Performance trends by exercise type and time period
- Progress comparison with previous workouts

**Social Platform**

- Community workout sharing with privacy controls
- Like system for user engagement
- Public/private workout visibility settings

<br/>

## 💡 Code Quality & Architecture Highlights

### 1. TypeScript Implementation - Precise Type Safety

#### Comprehensive Type Definitions (`app/api/types.ts`)

```typescript
export interface RegisteredProgram {
  _id: string;
  userId: string;
  programName: string;
  exercises: CartProps[];
  lastCompletedAt?: Date;
  deleted?: boolean;
}

export interface MyStat extends UserOwnedEntity {
  userId: string;
  likedUserIds?: string[];
  savedExercisesStatus: ExercisesStatus;
  completedAt: Date;
  satisfaction: number;
  title: string;
  note?: string;
}
```

#### Type-Safe State Management (`app/store.ts`)

```typescript
// Separated interfaces for clear responsibility boundaries
interface CartState {
  isUpdated: boolean;
  programName: string;
  stored: CartProps[];
  add: (item: CartProps) => void;
  remove: (itemId: string) => void;
  removeAll: () => void;
  addSettings: (settings: ExerciseSet[]) => void;
}

interface ProgressState {
  programId: string;
  workoutTime: number;
  savedExercisesStatus: ExercisesStatus;
  completedAt?: Date;
  saveWorkoutTime: (time: number) => void;
  resetWorkoutTime: () => void;
}
```

### 2. Performance Optimization - User Experience First

#### Image Loading Optimization (`app/utils/imageBlur.ts`)

```typescript
/**
 * Static blur data URL for exercise images
 * Optimized for typical exercise demonstration image aspect ratio
 */
export const exerciseImageBlurDataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...";

/**
 * Static blur data URL for user-generated content (workout photos)
 * Square aspect ratio for workout completion photos
 */
export const userPhotoBlurDataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...";
```

#### Dynamic Component Loading (`app/component/LazyLottiePlayer.tsx`)

```typescript
// Lazy load heavy Lottie library to reduce initial bundle size
const LazyLottie = dynamic(() => import("lottie-react"), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded w-full h-full" />
  ),
  ssr: false, // Client-side only for animation performance
});

// On-demand animation loading
const loadAnimation = async (type: AnimationTypes) => {
  switch (type) {
    case "complete":
      return (await import("@/public/lottie-animation/complete.json")).default;
    case "loading":
      return (await import("@/public/lottie-animation/loading.json")).default;
    // ... other animation types
  }
};
```

### 3. Component Architecture - Reusable & Predictable

#### Modal System (`app/component/ModalWrapper.tsx`)

```typescript
export type ModalWrapperProps = {
  isOpen: boolean;
  onClose: () => void;
  Title?: ReactNode;
  children: ReactNode;
  customClassName?: string;
};

export const ModalWrapper = ({
  isOpen,
  onClose,
  Title,
  children,
}: ModalWrapperProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOpen(isOpen);
      const timer = setTimeout(() => setVisible(true), MODAL_VISIBLE_DELAY);
      return () => clearTimeout(timer);
    } else {
      // Graceful close animation
      const timer = setTimeout(() => setVisible(false), MODAL_VISIBLE_DELAY);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ... render logic with smooth transitions
};
```

### 4. API Design - Consistent & Maintainable

#### RESTful API Patterns (`app/api/programs/route.ts`)

```typescript
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const includeDeleted = searchParams.get("includeDeleted") === "true";

  try {
    const result = await db
      ?.collection("programs")
      .find({
        userId: userId,
        ...(!includeDeleted && { deleted: { $ne: true } }),
      })
      .sort({ lastCompletedAt: -1 })
      .toArray();

    const data = result?.map((item) => ({
      ...item,
      _id: item._id.toString(),
      userId: item.userId.toString(),
    }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Programs fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}
```

### 5. Testing Strategy - Comprehensive Coverage

#### Component Testing (`tests/unit/ModalWrapper.test.tsx`)

```typescript
describe("ModalWrapper", () => {
  it("should handle modal open/close states correctly", async () => {
    const mockOnClose = jest.fn();
    const { rerender } = render(
      <ModalWrapper isOpen={false} onClose={mockOnClose}>
        <div>Test Content</div>
      </ModalWrapper>
    );

    // Test closed state
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Test open state
    rerender(
      <ModalWrapper isOpen={true} onClose={mockOnClose}>
        <div>Test Content</div>
      </ModalWrapper>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
```

#### API Testing with MSW (`tests/e2e/programs.e2e.test.ts`)

```typescript
describe("Programs API", () => {
  beforeEach(() => {
    server.use(
      rest.get("/api/programs", (req, res, ctx) => {
        return res(
          ctx.json({
            data: mockProgramsData,
          })
        );
      })
    );
  });

  it("should fetch user programs successfully", async () => {
    const response = await request(app).get("/api/programs");
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });
});
```

<br/>

## 📁 Project Structure

```
app/
├── api/                    # Next.js API routes
│   ├── auth/              # NextAuth.js authentication
│   ├── programs/          # Program CRUD operations
│   ├── exercise/          # Exercise data management
│   ├── my-stats/          # Analytics and statistics
│   └── types.ts           # Shared API type definitions
├── component/             # Reusable UI components
│   ├── ModalWrapper.tsx   # Base modal system
│   ├── LazyLottiePlayer.tsx # Performance-optimized animations
│   └── ...               # Other UI components
├── hook/                  # Custom React hooks
│   ├── useSnackbar.tsx   # Toast notification system
│   └── useWindowSize.tsx # Responsive design helper
├── utils/                 # Utility functions
│   ├── imageBlur.ts      # Image optimization utilities
│   ├── index.ts          # Common helper functions
│   └── mongoClient.ts    # Database connection
└── store.ts              # Zustand state management

tests/
├── unit/                 # Component unit tests
├── integration/          # Feature integration tests
├── e2e/                 # End-to-end API tests
├── __mocks__/           # Test mocks and fixtures
└── setupTests.ts        # Test environment configuration
```

<br/>

## 🎨 Overview UI and Manual

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
