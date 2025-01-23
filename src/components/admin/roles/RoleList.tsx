import * as React from "react";

export function RoleList({ roles, onEditRole, onManagePermissions, onCreateRole }) {
  return (
    <div className="space-y-4">
      <table className="w-full text-left table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b">
              <td className="px-4 py-2">{role.name}</td>
              <td className="px-4 py-2">{role.description}</td>
              <td className="px-4 py-2">
                <button
                  className="mr-2 text-blue-500 hover:underline"
                  onClick={() => onEditRole(role)}
                >
                  Edit
                </button>
                <button
                  className="text-green-500 hover:underline"
                  onClick={() => onManagePermissions(role)}
                >
                  Manage Permissions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="px-4 py-2 text-white bg-blue-500 rounded" onClick={onCreateRole}>
        Create New Role
      </button>
    </div>
  );
}
