[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/TGHrDa37)
 Christoffel's Kitchen - Private Chef App

Welcome to Christoffel's Kitchen, a cross-platform application built with React Native and TypeScript. This app provides a seamless experience for users to browse a private chef's menu, place orders, and for the chef to manage their culinary creations.

The entire application is currently built within a single `App.tsx` file, demonstrating a "monolithic component" architecture suitable for rapid prototyping and small-scale projects.



Features

The app has two primary roles: **User** and Chef.

 User Features

- Authentication: Secure Login and Sign Up pages.
- Dynamic Menu: Browse food items categorized into Starters, Mains, and Desserts.
- Search: Instantly search for specific food items.
- Item Details: Tap on an item to view a detailed modal with description, pricing, and quantity selection.
- Shopping Cart: Add items to a cart, view the total, and proceed to a simulated checkout.
- Bookmarking: Save favorite items for later.
- Profile Management: A dedicated profile screen.
- Responsive Design:
  - A mobile-first view with a bottom navigation bar and a slide-in side menu.
  - A desktop-friendly web layout with a persistent sidebar for navigation.

 Chef Features

- Chef Dashboard: A separate interface for menu management.
- CRUD Operations:
  - Create: Add new items to the menu via a dedicated form.
  - Read: View all menu items, filterable by category.
  - Update: Edit existing item details in a modal.
  - Delete: Remove items from the menu with a confirmation prompt.
- Analytics: View the average price for each menu category.



 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

 Prerequisites

You will need Node.js and either npm or Yarn installed. It is also recommended to install the Expo CLI.

```bash
npm install -g expo-cli
```

Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd PrivateChefApp
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Run the application:
    Start the Metro Bundler with Expo.
    ```bash
    npx expo start
    ```

This will open a new tab in your web browser with the Expo Developer Tools. From here, you can:
- Run the app on an iOS or Android simulator.
- Run the app on a physical device using the Expo Go app.
- Run the app in your web browser.



 Tech Stack & Architecture

- Framework: React Native with Expo
- Language: TypeScript
- Styling: React Native `StyleSheet` with platform-specific and responsive styles.
- Icons: Custom SVG components for a consistent look and feel.
- State Management: All application state is managed within the root `App` component using React Hooks (`useState`, `useEffect`). State is passed down to child components via props.
- Navigation: A custom routing system is implemented using a `page` state variable. The `renderPage` function acts as a switch based router to display the appropriate screen component.
- Data: The app currently uses mock data stored in a local array (`initialMenuData`). There is no external database or API connection.



 File Structure

This project uses a single-file structure for simplicity. All logic, components, types, and styles are located in `App.tsx`.

The file is organized as follows:

1.  Type Definitions: TypeScript types for core entities (`MenuItem`, `Page`, `UserRole`, etc.).
2.  Mock Data: The `initialMenuData` array that powers the menu.
3.  SVG Icons: Functional components for all icons used in the app.
4.  UI Components:
    - Screen Components: Each major view (e.g., `UserMenuScreen`, `ChefMenuScreen`, `CartScreen`) is a separate component.
    - Shared Components: Reusable components like `Modal`, `CategoryButton`, and `MenuItemCard`.
5.  Main App Component: The root `App` component which holds all state and logic for navigation, data manipulation, and authentication.
6.  Styles: A single, large `StyleSheet.create` object at the end of the file contains all styles for the application.



Screenshots

Auth Screens:

<img width="267" height="622" alt="Screenshot 2025-11-13 at 14 15 53" src="https://github.com/user-attachments/assets/9622e430-bdfd-4013-91ed-8b3e01f90013" />
<img width="306" height="628" alt="Screenshot 2025-11-13 at 14 17 18" src="https://github.com/user-attachments/assets/a25d7f26-5a2a-45d5-8463-aa2a8150b142" />

Menu Screens:

<img width="290" height="641" alt="Screenshot 2025-11-13 at 14 32 31" src="https://github.com/user-attachments/assets/a197c8cd-52ae-4539-861a-bd6cb3b40234" />
<img width="290" height="644" alt="Screenshot 2025-11-13 at 14 19 16" src="https://github.com/user-attachments/assets/e2d42b76-51b8-466e-8145-b43a3016f631" />
<img width="284" height="643" alt="Screenshot 2025-11-13 at 14 19 52" src="https://github.com/user-attachments/assets/9416f039-8fa6-4293-bf4a-0b4717f90248" />
<img width="288" height="649" alt="Screenshot 2025-11-13 at 14 20 56" src="https://github.com/user-attachments/assets/cc3d4941-223c-45f7-90b7-0a78c814114b" />

Bookmark Sreen:

<img width="291" height="650" alt="Screenshot 2025-11-13 at 14 22 25" src="https://github.com/user-attachments/assets/ac9e74bd-69d4-4171-b779-4d603d9a21e4" />

Cart Screen:

<img width="279" height="643" alt="Screenshot 2025-11-13 at 14 23 16" src="https://github.com/user-attachments/assets/47fb90f9-61a3-43a5-93d3-5ed5135dbb88" />

Checkout Screen:

<img width="301" height="656" alt="Screenshot 2025-11-13 at 14 23 45" src="https://github.com/user-attachments/assets/df62aeaa-bdd1-4b53-a9d4-9c63b938ee8f" />

Menu Screen:

<img width="286" height="662" alt="Screenshot 2025-11-13 at 14 25 25" src="https://github.com/user-attachments/assets/4bca865d-156a-4854-94cb-403b33a52bef" />

Profile Screen:

<img width="307" height="676" alt="Screenshot 2025-11-13 at 14 26 04" src="https://github.com/user-attachments/assets/688b92d6-27e7-467a-bacb-214dccee2f74" />

Search Screen:

<img width="284" height="642" alt="Screenshot 2025-11-13 at 14 26 49" src="https://github.com/user-attachments/assets/b6846183-3048-4a16-bc02-3fea750cd8f4" />

Edit Menu Chef's Screen:

<img width="286" height="662" alt="Screenshot 2025-11-13 at 14 27 43" src="https://github.com/user-attachments/assets/83e2e150-c40e-4c20-8ae4-94ca6a456b9e" />
<img width="293" height="657" alt="Screenshot 2025-11-13 at 14 28 08" src="https://github.com/user-attachments/assets/4f9b6f72-2f5b-410e-89ed-cd78d9dae295" />
<img width="289" height="651" alt="Screenshot 2025-11-13 at 14 28 27" src="https://github.com/user-attachments/assets/9bd2763f-f1b6-46d1-af16-ab2c43d15bd9" />
<img width="316" height="682" alt="Screenshot 2025-11-13 at 14 29 04" src="https://github.com/user-attachments/assets/d49169ec-dd42-414c-951f-85cb4c8d4e71" />
<img width="291" height="639" alt="Screenshot 2025-11-13 at 14 28 41" src="https://github.com/user-attachments/assets/bfe50a6e-a127-4183-ab5f-e0c0de494ef5" />














