import { describe, expect, test, vi } from "vitest";
import { RegisterEmployeeAccountService } from "@/services/RegisterEmployeeAccountService";

describe("RegisterEmployeeAccountService", () => {
    test("未登録社員一覧を取得できる", async () => {

        // Arrange
        const employees = [
            {
                employeeUuid: "11111111-1111-1111-1111-111111111111",
                employeeName: "山田太郎",
            },
        ];

        const employeeRepository = {
            getUnregisteredEmployees: vi.fn().mockResolvedValue(employees),
            addEmployeeAccount: vi.fn(),
        };

        const service = new RegisterEmployeeAccountService(
            employeeRepository as any
        );

        // Act
        const result = await service.getUnregisteredEmployees();

        // Assert
        expect(employeeRepository.getUnregisteredEmployees)
            .toHaveBeenCalledTimes(1);

        expect(result).toEqual(employees);
    });
});
test("担当者アカウントを登録できる", async () => {

    // Arrange
    const registration = {
        employeeUuid: "11111111-1111-1111-1111-111111111111",
        accountName: "taro01",
        password: "Pass123",
    };

    const employeeRepository = {
        getUnregisteredEmployees: vi.fn(),
        addEmployeeAccount: vi.fn().mockResolvedValue(undefined),
    };

    const service = new RegisterEmployeeAccountService(
        employeeRepository as any
    );

    // Act
    await service.registerEmployeeAccount(registration as any);

    // Assert
    expect(employeeRepository.addEmployeeAccount)
        .toHaveBeenCalledTimes(1);

    expect(employeeRepository.addEmployeeAccount)
        .toHaveBeenCalledWith(registration);
});
test("担当者アカウント登録時にRepositoryでエラーが発生した場合は例外をスローする", async () => {

    // Arrange
    const registration = {
        employeeUuid: "11111111-1111-1111-1111-111111111111",
        accountName: "taro01",
        password: "Pass123",
    };

    const employeeRepository = {
        getUnregisteredEmployees: vi.fn(),
        addEmployeeAccount: vi.fn().mockRejectedValue(
            new Error("登録失敗")
        ),
    };

    const service = new RegisterEmployeeAccountService(
        employeeRepository as any
    );

    // Act & Assert
    await expect(
        service.registerEmployeeAccount(registration as any)
    ).rejects.toThrow("登録失敗");
});
test("未登録社員一覧取得時にRepositoryでエラーが発生した場合は例外をスローする", async () => {

    // Arrange
    const employeeRepository = {
        getUnregisteredEmployees: vi.fn().mockRejectedValue(
            new Error("取得失敗")
        ),
        addEmployeeAccount: vi.fn(),
    };

    const service = new RegisterEmployeeAccountService(
        employeeRepository as any
    );

    // Act & Assert
    await expect(
        service.getUnregisteredEmployees()
    ).rejects.toThrow("取得失敗");

    expect(employeeRepository.getUnregisteredEmployees)
        .toHaveBeenCalledTimes(1);
});