export default {
    type: 'object',
    properties: {
        error: { type: 'string' },
        code: { type: 'string' }
    },
    example: {
        error: 'Invalid country code format',
        code: 'INVALID_COUNTRY_CODE_FORMAT'
    }
}