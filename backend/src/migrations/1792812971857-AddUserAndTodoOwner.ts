import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAndTodoOwner1792812971857
  implements MigrationInterface
{
  name = 'AddUserAndTodoOwner1792812971857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."user_role_enum"
      AS ENUM('USER', 'ADMIN')
    `);

    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "role" "public"."user_role_enum"
          NOT NULL DEFAULT 'USER',
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "todo"
      ADD "ownerId" uuid
    `);

    await queryRunner.query(`
      ALTER TABLE "todo"
      ADD CONSTRAINT "FK_todo_owner"
      FOREIGN KEY ("ownerId")
      REFERENCES "user"("id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "todo"
      DROP CONSTRAINT "FK_todo_owner"
    `);

    await queryRunner.query(`
      ALTER TABLE "todo"
      DROP COLUMN "ownerId"
    `);

    await queryRunner.query(`DROP TABLE "user"`);

    await queryRunner.query(`
      DROP TYPE "public"."user_role_enum"
    `);
  }
}