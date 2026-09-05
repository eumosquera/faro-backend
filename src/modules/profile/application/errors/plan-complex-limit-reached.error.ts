import { ApplicationError } from '../../../../core/errors/application-error';

export class PlanComplexLimitReachedError extends ApplicationError {
  constructor(planName: string, maxComplexes: number) {
    super({
      code: 'PLAN_COMPLEX_LIMIT_REACHED',
      message: `Tu plan "${planName}" permite hasta ${maxComplexes} ${maxComplexes === 1 ? 'copropiedad' : 'copropiedades'}. Actualiza tu plan para agregar más.`,
      statusCode: 402,
    });
  }
}
