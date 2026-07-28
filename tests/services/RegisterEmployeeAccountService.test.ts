import { describe, expect, test, vi } from "vitest";
import { RegisterEmployeeAccountService } from "@/services/RegisterEmployeeAccountService";

/**
 * RegisterEmployeeAccountServiceのコンストラクタが
 * 第1引数として要求しているRepositoryの型
 */
type EmployeeRepository =
    ConstructorParameters<typeof RegisterEmployeeAccountService>[0];

/**
 * registerEmployeeAccountメソッドが
 * 第1引数として要求している登録情報の型
 */
type EmployeeAccountRegistration =
    Parameters<
        RegisterEmployeeAccountService["registerEmployeeAccount"]
    >[0];

describe("RegisterEmployeeAccountService", () => {
    test("未登録社員一覧を取得できる", async () => {
        // Arrange
        const employees = [
            {
                employeeUuid: "11111111-1111-1111-1111-111111111111",
                employeeName: "山田太郎",
            },
        ];

        const employeeRepository: EmployeeRepository = {
            getUnregisteredEmployees: vi.fn().mockResolvedValue(employees),
            addEmployeeAccount: vi.fn(),
        };

        const service = new RegisterEmployeeAccountService(
            employeeRepository
        );

        // Act
        const result = await service.getUnregisteredEmployees();

        // Assert
        expect(
            employeeRepository.getUnregisteredEmployees
        ).toHaveBeenCalledTimes(1);

        expect(result).toEqual(employees);
    });

    test("担当者アカウントを登録できる", async () => {
        // Arrange
        const registration: EmployeeAccountRegistration = {
            employeeUuid: "11111111-1111-1111-1111-111111111111",
            accountName: "taro01",
            password: "Pass123",
        };

        const employeeRepository: EmployeeRepository = {
            getUnregisteredEmployees: vi.fn(),
            addEmployeeAccount: vi.fn().mockResolvedValue(undefined),
        };

        const service = new RegisterEmployeeAccountService(
            employeeRepository
        );

        // Act
        await service.registerEmployeeAccount(registration);

        // Assert
        expect(
            employeeRepository.addEmployeeAccount
        ).toHaveBeenCalledTimes(1);

        expect(
            employeeRepository.addEmployeeAccount
        ).toHaveBeenCalledWith(registration);
    });

    test(
        "担当者アカウント登録時にRepositoryでエラーが発生した場合は例外をスローする",
        async () => {
            // Arrange
            const registration: EmployeeAccountRegistration = {
                employeeUuid: "11111111-1111-1111-1111-111111111111",
                accountName: "taro01",
                password: "Pass123",
            };

            const employeeRepository: EmployeeRepository = {
                getUnregisteredEmployees: vi.fn(),
                addEmployeeAccount: vi.fn().mockRejectedValue(
                    new Error("登録失敗")
                ),
            };

            const service = new RegisterEmployeeAccountService(
                employeeRepository
            );

            // Act & Assert
            await expect(
                service.registerEmployeeAccount(registration)
            ).rejects.toThrow("登録失敗");
        }
    );

    test(
        "未登録社員一覧取得時にRepositoryでエラーが発生した場合は例外をスローする",
        async () => {
            // Arrange
            const employeeRepository: EmployeeRepository = {
                getUnregisteredEmployees: vi.fn().mockRejectedValue(
                    new Error("取得失敗")
                ),
                addEmployeeAccount: vi.fn(),
            };

            const service = new RegisterEmployeeAccountService(
                employeeRepository
            );

            // Act & Assert
            await expect(
                service.getUnregisteredEmployees()
            ).rejects.toThrow("取得失敗");

            expect(
                employeeRepository.getUnregisteredEmployees
            ).toHaveBeenCalledTimes(1);
        }
    );
});