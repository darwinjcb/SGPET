/*
  Warnings:

  - The `estadoEquipoAlDevolver` column on the `Devolucion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EstadoDevolucion" AS ENUM ('BUENO', 'CON_DANOS', 'NO_FUNCIONAL');

-- AlterTable
ALTER TABLE "Devolucion" DROP COLUMN "estadoEquipoAlDevolver",
ADD COLUMN     "estadoEquipoAlDevolver" "EstadoDevolucion" NOT NULL DEFAULT 'BUENO';
