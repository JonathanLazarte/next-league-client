# Next League Client

A high-fidelity recreation of the League of Legends desktop client, rebuilt as a modern web application with Next.js and React.

The project focuses on reproducing the original client's interface, navigation flows, interactive systems, animations, and real-time features while exploring frontend architecture, state management, performance optimization, and reusable UI infrastructure.

> This repository contains the client application. The backend is maintained separately.

## Live Demo

https://next-league-client.vercel.app

## Overview

Next League Client is a personal full-stack project centered around recreating a complex desktop application inside the browser.

Rather than being a static UI recreation, the project implements interconnected application flows such as:

- Authentication
- Champion and skin collections
- Champion detail views
- Store and purchase flows
- Game mode selection
- PvP and Co-op vs. AI flows
- Lobby interfaces
- Real-time chat
- User presence
- Application settings
- Dynamic tooltips
- Virtualized collections
- Loading and navigation states
- Animations and transitions

The project currently contains the frontend/client application, which communicates with a separately maintained Node.js/Express backend through REST APIs and Socket.io.

## Features

### Collection

- Champion collection
- Skin collection
- Filtering and navigation
- Support for 1,800+ skin items
- Virtualized rendering for large collections
- Champion detail modal
- Champion overview, abilities, and skins

### Store

- Champion store
- Skin store
- Reusable store cards
- Purchase confirmation modal
- Shared state for purchases and owned content

### Game Modes

- PvP mode selection
- Co-op vs. AI
- Map selection
- Summoner's Rift
- ARAM
- Queue selection
- Lobby flow

### Real-Time Communication

- Real-time chat
- Connected-user presence
- Socket.io communication
- Centralized client state synchronization

### UI Systems

- Reusable modal architecture
- Loading states and overlays
- Responsive navigation
- Custom select components
- Global tooltip system
- Specialized tooltip variants
- Animated transitions and overlays
- Audio and sound management

## Technical Highlights

### Application Architecture

The application is organized around Next.js App Router routes and a shared `src` layer containing reusable components, hooks, Redux state, services, utilities, and UI systems.

The project separates route-level features from reusable application infrastructure, making components such as tooltips, virtualized grids, navigation, chat, modals, and loading states available across multiple parts of the application.

### State Management

Redux Toolkit is used for centralized client-side state.

The application contains separate slices for areas such as:

- Authentication
- Chat
- Connected users
- Matchmaking
- Notifications
- Profile
- Purchases
- Settings
- Sound
- Store
- Tooltips
- User champions
- User skins
- User interface state

This allows independent features to communicate through shared application state without tightly coupling their components.

### Data Fetching

TanStack React Query is used for server-state management and asynchronous data fetching.

Custom hooks encapsulate data access and application behavior, including:

- `useChampions`
- `useSkins`
- `useAuth`
- `useChatSocket`
- `useTooltip`
- `useHoverIntent`
- `useResizeObserver`
- `useContainerSize`
- `useDebounce`
- `useThrottle`
- `useSound`

### Virtualized Rendering

Large collections are rendered through reusable virtualized grid components.

The project includes specialized grids for:

- Champions
- Skins
- Store content

Virtualization reduces the number of DOM elements rendered simultaneously, which is particularly useful when working with large collections such as the project's 1,800+ skin dataset.

### Global Tooltip Infrastructure

One of the more involved reusable UI systems in the project is the global tooltip architecture.

The system supports multiple tooltip variants while sharing common infrastructure for:

- Portal-based rendering
- Adaptive positioning
- Hover intent
- Tooltip triggers
- Tooltip layers
- Tooltip arrows
- Shared tooltip state
- Specialized content

The tooltip infrastructure is used throughout the application rather than being implemented independently inside individual components.

### Real-Time Architecture

Real-time communication is handled through Socket.io between the client and the separate Node.js/Express backend.

The client encapsulates socket behavior through reusable hooks and integrates incoming events with the application's centralized state.

This architecture is used for features such as:

- Chat
- Connected-user presence
- Real-time status updates
- Matchmaking-related state

## Performance

Performance considerations have been part of the project from the beginning because several views operate on large collections and highly interactive interfaces.

Current approaches include:

- Virtualized lists and grids
- Reusable rendering infrastructure
- Debounced and throttled interactions
- Responsive resize observation
- Lazy/conditional rendering
- Shared UI systems
- Optimized interactive components

The project also includes custom hooks for container sizing, resize observation, hover intent, debouncing, throttling, and loading behavior.

## UI & Animation

Framer Motion is used for:

- Page transitions
- Overlays
- Modal animations
- Interactive states
- Micro-interactions
- Navigation feedback

The goal is not only to reproduce static visuals but also to reproduce the behavior and interaction patterns of the original desktop client.

## Project Structure

```text
next-league-client/
│
├── app/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   │
│   └── dashboard/
│       ├── collection/
│       ├── league/
│       ├── play/
│       └── store/
│
├── src/
│   ├── components/
│   │   ├── ChampionDetailModal/
│   │   ├── Tooltip/
│   │   ├── VirtualGrid/
│   │   ├── chat/
│   │   ├── cards/
│   │   ├── header/
│   │   └── ...
│   │
│   ├── engine/
│   ├── hooks/
│   ├── redux/
│   │   └── slices/
│   ├── services/
│   ├── styles/
│   ├── svg/
│   └── utils/
│
└── public/
