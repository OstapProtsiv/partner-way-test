import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1697308362365 implements MigrationInterface {
  name = 'Init1697308362365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "weather" ("id" SERIAL NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "part" character varying NOT NULL, "data" jsonb NOT NULL, CONSTRAINT "PK_af9937471586e6798a5e4865f2d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_weather_unique_input" ON "weather" ("latitude", "longitude", "part") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UQ_weather_unique_input"`);
    await queryRunner.query(`DROP TABLE "weather"`);
  }
}
