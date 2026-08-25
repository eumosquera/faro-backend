import 'reflect-metadata';
import { REQUIRED_PERMISSION_KEY, RequirePermission } from './require-permission.decorator';

describe('RequirePermission', () => {
  it('should define the required permission metadata', () => {
    class TestController {
      updateResident(): void {}
    }

    const descriptor = Object.getOwnPropertyDescriptor(TestController.prototype, 'updateResident');

    if (!descriptor?.value) {
      throw new Error('Method descriptor not found');
    }

    RequirePermission('RESIDENT_UPDATE')(TestController.prototype, 'updateResident', descriptor);

    const permission: unknown = Reflect.getMetadata(REQUIRED_PERMISSION_KEY, descriptor.value);

    expect(permission).toBe('RESIDENT_UPDATE');
  });
});
