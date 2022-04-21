import { IMappingStrategy, MapperRegistry } from "http-problem-details-mapper"

export default class ErrorProblemMappingStrategy implements IMappingStrategy {
  registry: MapperRegistry

  constructor(registry: MapperRegistry) {
    this.registry = registry
  }

  map(error: Error) {
    const err = error
    const errorMapper = this.registry.getMapper(error)
    if (errorMapper) {
      return errorMapper.mapError(err)
    }

    // alternatively, return a generic problem document
    throw new Error("Could not map error")
  }
}
