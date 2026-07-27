import { beforeEach, describe, expect, it, vi } from "vitest";
import { EmployeeRepository } from "@/infrastructures/EmployeeRepositoy";

describe("EmployeeRepository", () => {

    let repository: EmployeeRepository;

    beforeEach(() => {
        repository = new EmployeeRepository();
        vi.restoreAllMocks();
    });

    describe("getUnregisteredEmployees", () => {

        it("未登録社員一覧を取得できる", async () => {

            const employees = [
                {
                    employeeUuid: "1",
                    employeeCode: "EMP001",
                    employeeName: "山田太郎",
                },
            ];

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
                json: async () => ({
                    employees,
                }),
            } as Response);

            const result =
                await repository.getUnregisteredEmployees();

            expect(result).toEqual(employees);
        });

        it("取得に失敗した場合は例外になる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 500,
            } as Response);

            await expect(
                repository.getUnregisteredEmployees(),
            ).rejects.toThrow(
                "未登録社員一覧の取得に失敗しました。(status : 500)",
            );
        });

    });

    describe("addEmployeeAccount", () => {

        const account: Parameters<EmployeeRepository["addEmployeeAccount"]>[0] = {
            employeeUuid: "1",
            accountName: "testuser",
            password: "password123",
        };

        it("従業員アカウントを登録できる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: true,
            } as Response);

            await expect(
                repository.addEmployeeAccount(account),
            ).resolves.toBeUndefined();
        });

        it("409エラーの場合は重複エラーになる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 409,
            } as Response);

            await expect(
                repository.addEmployeeAccount(account),
            ).rejects.toThrow(
                "このアカウント名は既に使用されています",
            );
        });

        it("登録に失敗した場合は例外になる", async () => {

            vi.spyOn(global, "fetch").mockResolvedValue({
                ok: false,
                status: 500,
            } as Response);

            await expect(
                repository.addEmployeeAccount(account),
            ).rejects.toThrow(
                "従業員アカウントの登録に失敗しました。(status : 500)",
            );
        });

    });

});