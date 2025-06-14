export default {
    type: 'object',
    additionalProperties: {
        type: 'integer',
        format: 'int32',
        minimum: 1,
        exclusiveMinimum: false
    },
    description: 'Key-value pairs where keys are country codes (ISO 3166-1 alpha-2) and values are positive integers',
    example: {
        US: 42,
        CA: 5,
        GB: 1
    }
};