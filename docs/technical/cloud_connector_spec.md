# 🔌 The EZ Cloud Connector: Bridge Architecture

How local engines consume the Cloud-Hosted Agnostic Core.

## 1. The "Thin Client" Philosophy
To maintain maximum **IP Protection**, the local engine (Roblox/Unity/Godot) should never run the core procedural logic. Instead, it acts as a "Thin Client" that:
1. **Authenticates** with the EZ Cloud API.
2. **Dispatches** the user's Intent object.
3. **Receives** a serialized, ready-to-instantiate asset package.

## 2. Platform-Specific Implementations

### A. Roblox Connector (.lua)
- A lightweight `ModuleScript` inside Roblox Studio.
- Uses `HttpService` to POST to the EZ Web API.
- Receives the Luau source code for the "Art-Finalized" asset and uses `loadstring()` (or pre-instantiated templates) to build the world instantly.

### B. Unity/Godot Connectors (C# / GDScript)
- A specialized Editor Plugin.
- Connects via REST or WebSockets for real-time streaming of large worlds.
- Receives a JSON/AssetBundle and instantiates it using the local engine's API.

## 3. Security & Compliance (Safety Engine)
- **API-Key Auth**: Individual keys for developers, with tiered usage.
- **Audit Logs**: Every asset generated is logged for compliance (LGPD/COPPA).
- **Watermarking**: Generated code includes invisible hashes (EZ-Hash) to prove authenticity and ownership.

## 4. The "One-Click" User Flow
1. User clicks **"Generate World"** in the Web Studio.
2. The Web Hub sends the Intent to the Cloud Core.
3. The Cloud Core collapses the world and generates the engine-specific package.
4. The Cloud Hub "pushes" the update to the local Connector (or provides a download link).

---
**EZ Cloud Connector** — *Secure. Lightweight. Universal.*
