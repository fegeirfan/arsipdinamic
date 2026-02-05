# **App Name**: Arsipku: Dynamic Records

## Core Features:

- Dynamic Table Builder: Enables admin and authorized staff to create, edit, and manage archive tables with customizable columns, data types, and validation rules directly through the UI.
- Role-Based Access Control: Implements a role-based permission system with 'Admin' and 'Staff' roles, along with granular permission controls for each table (View, Insert, Edit, Delete) managed via Supabase RLS policies.
- PIC (Person In Charge) Assignment: Allows assignment of one or more PICs to each archive table, defining responsibility for table structure, data validation, and content.
- Public/Private Table Visibility: Supports table visibility settings to define access levels: 'Public' for general access and 'Private' for restricted access to PICs and admins only.
- Supabase Integration: Utilizes Supabase for database management, authentication, and storage (Supabase RLS).

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) to convey trust, authority, and competence.
- Background color: Very light grey (#F5F5F5) for a clean, modern interface.
- Accent color: Soft Blue (#50B4EB) for interactive elements and highlights.
- Body and headline font: 'Inter', a grotesque-style sans-serif font that conveys a modern, objective, neutral look suitable for headlines or body text. 
- Use simple, professional icons from a consistent set (e.g., Material Design Icons) to represent actions, file types, and table visibility (public/private).
- Emphasize a clear, hierarchical layout using the Next.js App Router structure described. Utilize consistent spacing and alignment for readability.
- Use subtle transitions and animations (e.g., modal appearing/disappearing, loading indicators) to provide visual feedback and enhance user experience.