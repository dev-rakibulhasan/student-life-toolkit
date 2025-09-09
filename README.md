# Student Life Toolkit

## About Student Life Toolkit

This tool will help students to make their life easy. Features available in this platform:

- Modern informative dashboard
- Class scheduler
- Budget tracker
- Study planner
- Time tracker
- Question Generator
- Instructors directory
- Subjects Directory

## Features Overview

Here is the deep overviews of all the tools and features:

### Dashboard:

- Students can see Total Schedules, Total Instructors, Pending Tasks, Current Balance, Income vs Expenses, Pending Tasks By Priority,Recent Transactions and This Weeks Study Time (In a line chart).
  `-  If Students balance is less thsn 100 taka, Then they will see an warning message in dashboard. If total expense is greater than total income, Then they will see an alert message in the dashboard. If financial status is good. Then it will show a positive message in the dashboard.`
- Student will see financial advice with a typing effect in the Income vs Expenses card.
  ![Alt text](image-url)

### Class scheduler:

- Student can create, read, update, delete, class schedule.
- There are available time slot from 8 AM to 8 PM by 15 minutes itaration. And 7 days are availble as day slots.
- To create time slot, Students need to select subject, instructor, day, time and color. They can create subject and instructors details for farther use.
- Student can't create multiple schedule in same time slot. It will retun an error message.
  ![Alt text](image-url)

### Budget tracker:

- Student can can create, read, update and delete their income and expense records. The changes will reflect real time in UI.
- They can filter records by, Income, Expense, and Today, Yesterday, This week, This month, This year and Lifetime basis.
- They can check their income and expenses amount and percentage by categories in progress bars.

### Study planner:

- Student can create, read, update, delete study tasks.
- They can check tasks progress by priority.
- They can filter task by Subject, Priority and Status.
- They can toggle task status from pending to completed.

### Time Tracker:

- Users can select a subject, add a note then start a study session during their study time. So, Our system will track how many minutes or hours the studied on a specefic subject and topic.
- Each study session records will be shown on the time tracker page. Student can delete a session record if they want.
- Student can see their Today, Yesterday, This week, This month, This year and Lifetime study progress by all or any specefic subject in a line chart.

### Question Generator:

- Student can generate qestions by AI. The student just have to select subject, Difficulty, Question type and enter the topic and number of questions they want to generate. When they they will click on the Generate Questions button, It will automatically create questions by the students demand.
- After creating questions by AI, System will redirect student to practice mode with the newly generated questions.
- Also student can create questions manually.
- Student can update and delete their questions.
- Student can see their quiz performance in a donut chart with Accuracy, Current Streak, Best Streak in practice mode.
- Student can filter questions by, Subject, Topic, Difficulty and Type. They also can search questions.

### Instructors directory:

- Students can create, read, update, delete instructors information.
- They can directly contact with any instructor listed in this directory.
- They can use the listed instructors info during class schedule creation.

### Subjects Directory:

- Student can create read, update, delete their subjects with subject name, description and color.
- Later they can use the listed subjects for Class scheduler, Study planner, Time tracker and Question Generator
- Created subjects colors will be shown as line color in the line chart.

## Technologies I used

### Frontend:

- @tailwindcss/vite: ^4.1.10
- axios: ^1.10.0
- daisyui: ^5.0.43
- jwt-decode: ^4.0.0
- moment: ^2.30.1
- react: ^19.1.0
- react-dom: ^19.1.0
- react-hot-toast: ^2.6.0
- react-router-dom: ^7.6.2
- recharts: ^3.1.2
- tailwindcss: ^4.1.10
- vite: ^6.3.5

### Backend:

- bcryptjs: ^3.0.2
- cookie-parser: ^1.4.7
- cors: ^2.8.5
- dotenv: ^16.5.0
- express: ^4.21.2
- jsonwebtoken: ^9.0.2
- mongoose: ^8.12.1
- openai: ^5.19.1

### Database:

- Mongo DB

### AI Model:

- GPT 4.1 nano
