export function SafeReturn(sensitiveFields = []) {
  return function (_target, _propertyName, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args) {
      // 调用原始方法
      const result = await originalMethod.apply(this, args);

      // 处理返回结果，移除敏感属性
      const sanitizedResult = { ...result };
      sensitiveFields.forEach((field) => {
        delete sanitizedResult[field];
      });

      return sanitizedResult;
    };

    return descriptor;
  };
}