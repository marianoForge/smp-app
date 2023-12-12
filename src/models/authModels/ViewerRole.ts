import { Schema, model, models } from "mongoose";

interface RoleType {
  name: string;
  description: string;
  permissions: {
    canEdit: boolean;
    canView: boolean;
    canDelete: boolean;
    canCreate: boolean;
  };
}

const ViewerRoleSchema = new Schema<RoleType>({
  name: {
    type: String,
    default: "Admin",
  },
  description: {
    type: String,
    default: "Administrador",
  },
  permissions: {
    canEdit: { type: Boolean, default: true },
    canView: { type: Boolean, default: true },
    canDelete: { type: Boolean, default: true },
    canCreate: { type: Boolean, default: true },
  },
  // Aquí puedes agregar más campos según lo requieras, como detalles del administrador, áreas específicas de responsabilidad, etc.
});

const ViewerRole =
  models.ViewerRoleSchema || model<RoleType>("AdminRole", ViewerRoleSchema);

export default ViewerRole;
