import { Request, Response } from "express";
import { UserRoleModel as UserRole } from "../models/UserRole";

export async function createUserRole(req: Request, res: Response) {
  try {
    const newUserRole = await UserRole.create(req.body);
    res.status(201).json(newUserRole);
  } catch (error: any) {
    res
      .status(500)
      .json({
        message: "Kullanıcı rolü oluşturma hatası",
        error: error.message,
      });
  }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const { id, name } = req.params;

    if (id) {
      // id parametresi mevcutsa id'ye göre güncelleme yap
      const updatedRole = await UserRole.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedRole) {
        return res.status(404).json({ message: "Rol bulunamadı" });
      }
      return res.status(200).json(updatedRole);
    } else if (name) {
      // name parametresi mevcutsa name'e göre güncelleme yap
      const updatedRole = await UserRole.findOneAndUpdate({ name }, req.body, {
        new: true,
      });
      if (!updatedRole) {
        return res.status(404).json({ message: "Rol bulunamadı" });
      }
      return res.status(200).json(updatedRole);
    } else {
      return res.status(400).json({ message: "Geçersiz istek" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Rol güncelleme hatası", error: error.message });
  }
}

export async function deleteUserRole(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletedRole = await UserRole.findByIdAndDelete(id);
    if (!deletedRole) {
      return res.status(404).json({ message: "Rol bulunamadı" });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: "Rol silme hatası", error: error.message });
  }
}

export async function getUserRoleByName(req: Request, res: Response) {
  try {
    const { name } = req.params;
    const role = await UserRole.findOne({ name });
    if (!role) {
      return res.status(404).json({ message: "Rol bulunamadı" });
    }
    res.status(200).json(role);
  } catch (error: any) {
    res.status(500).json({ message: "Rol alma hatası", error: error.message });
  }
}
