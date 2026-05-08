import { NoteRoom, InternalNote, RoomVisibility } from '../types/internal-notes';

export const STUB_ROOMS: NoteRoom[] = [
  {
    id: 1,
    name: "General Discussion",
    is_default: true,
    visibility: RoomVisibility.INTERNAL,
    created_by: 1,
    created_by_email: "admin@example.com",
    project: null,
    project_name: null,
    members: [1, 2, 3, 4, 5],
    created_at: "2026-05-07T10:00:00Z",
  },
  {
    id: 2,
    name: "Project Alpha Notes",
    is_default: false,
    visibility: RoomVisibility.PROJECT_SPECIFIC,
    created_by: 2,
    created_by_email: "owner@example.com",
    project: 1,
    project_name: "Project Alpha",
    members: [1, 2],
    created_at: "2026-05-07T10:15:00Z",
  },
  {
    id: 3,
    name: "Leadership Team",
    is_default: false,
    visibility: RoomVisibility.PRIVATE,
    created_by: 1,
    created_by_email: "admin@example.com",
    project: null,
    project_name: null,
    members: [1, 2, 3],
    created_at: "2026-05-07T10:30:00Z",
  },
  {
    id: 4,
    name: "Admin Only System Log",
    is_default: false,
    visibility: RoomVisibility.ADMIN_ONLY,
    created_by: 1,
    created_by_email: "admin@example.com",
    project: null,
    project_name: null,
    members: [1],
    created_at: "2026-05-07T10:45:00Z",
  }
];

export const STUB_MESSAGES: InternalNote[] = [
  {
    id: 1,
    room: 1,
    author: 1,
    author_email: "admin@example.com",
    content: "Welcome to General Discussion! This is where we share internal updates and notes.",
    created_at: "2026-05-07T10:00:00Z",
    updated_at: "2026-05-07T10:00:00Z",
    is_edited: false
  },
  {
    id: 2,
    room: 1,
    author: 2,
    author_email: "user@example.com",
    content: "Great! Looking forward to using this for better team collaboration.",
    created_at: "2026-05-07T10:05:00Z",
    updated_at: "2026-05-07T10:10:00Z",
    is_edited: true
  },
  {
    id: 3,
    room: 1,
    author: 3,
    author_email: "project_owner@example.com",
    content: "This will definitely help us organize our internal communications better.",
    created_at: "2026-05-07T10:15:00Z",
    updated_at: "2026-05-07T10:15:00Z",
    is_edited: false
  }
];
