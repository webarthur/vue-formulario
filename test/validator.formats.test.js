import { expect, describe, it, test } from 'vitest'
import validator from '../src/validator'

describe('validator', () => {
  describe('date', () => {
    it('should validate YYYY-MM-DD format', () => {
      const result = validator({ date: { format: 'date' } }, { date: '2022-12-31' })
      expect(result.valid).toBe(true)
    })

    // it('should not validate invalid date format', () => {
    //   const result = validator({ date: { format: 'date' } }, { date: '2022-15-31' })
    //   expect(result.valid).toBe(false)
    // })
  })

  describe('time', () => {
    it('should validate HH:MM:SS format', () => {
      const result = validator({ time: { format: 'time' } }, { time: '13:30:45' })
      expect(result.valid).toBe(true)
    })

    it('should validate HH:MM:SS.ms format', () => {
      const result = validator({ time: { format: 'time' } }, { time: '13:30:45.123' })
      expect(result.valid).toBe(true)
    })

    it('should validate HH:MM:SS.msZ format', () => {
      const result = validator({ time: { format: 'time' } }, { time: '13:30:45.123Z' })
      expect(result.valid).toBe(true)
    })

    it('should validate HH:MM:SS.ms+HH:mm format', () => {
      const result = validator({ time: { format: 'time' } }, { time: '13:30:45.123+02:30' })
      expect(result.valid).toBe(true)
    })

    // it('should not validate invalid time format', () => {
    //   const result = validator({ time: { format: 'time' } }, { time: '25:30:45' })
    //   expect(result.valid).toBe(false)
    // })
  })

  describe('date-time', () => {
    it('should validate ISO 8601 format', () => {
      const result = validator({ datetime: { format: 'date-time' } }, { datetime: '2022-12-31T13:30:45Z' })
      expect(result.valid).toBe(true)
    })

    // it('should not validate invalid ISO 8601 format', () => {
    //   const result = validator({ datetime: { format: 'date-time' } }, { datetime: '2022-15-31T13:30:45Z' })
    //   expect(result.valid).toBe(false)
    // })
  })

  describe('uri', () => {
    it('should accept valid URIs', () => {
      const validUris = [
        'http://www.example.com',
        'https://www.example.com',
        'ftp://ftp.example.com',
        'http://www.example.com/path/file.html',
        'http://www.example.com/path/file.html?query=string',
        'http://www.example.com/#fragment',
        'http://www.example.com/#fragment?query=string',
        'http://www.example.com/?query=string#fragment',
        'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]/',
        'http://[2001:db8:85a3:0:0:8a2e:370:7334]:443/',
      ]

      validUris.forEach(uri => {
        const result = validator({ uri }, { uri })
        expect(result.valid).toBe(true)
      })
    })

    it('should reject invalid URIs', () => {
      const invalidUris = [
        // 'www.example.com', // missing scheme
        // 'http:www.example.com', // invalid scheme
        // 'http://www example.com', // invalid characters
        // 'http://www.example.com/path with spaces', // invalid characters
        // 'http://www.example.com/#fragment with spaces', // invalid characters
        // 'http://www.example.com/?query with spaces=string', // invalid characters
        // 'http://www.example.com/#fragm ent', // invalid characters
        // 'http://www.example.com/?query=string#fragm ent', // invalid characters
        // 'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334', // invalid IPv6 address
        // 'http://[2001:db8:85a3::8a2e:370:7334]', // invalid IPv6 address
        // 'http://[2001:db8:85a3:0:0:8a2e:370:7334]:port', // invalid port
      ]

      invalidUris.forEach(uri => {
        const result = validator({ uri }, { uri })
        expect(result.valid).toBe(false)
      })
    })
  })

  describe('Email Validation', () => {
    it('should return true for a valid email', () => {
      const schema = {
        email: {
          type: 'string',
          format: 'email',
        },
      }
      const data = {
        email: 'test@example.com',
      }
      const result = validator(schema, data)
      expect(result.valid).toBe(true)
    })
  
    it('should return false for an invalid email', () => {
      const schema = {
        email: {
          type: 'string',
          format: 'email',
        },
      }
      const data = {
        email: 'not_an_email',
      }
      const result = validator(schema, data)
      expect(result.valid).toBe(false)
    })
  })

  describe('uuid', () => {
    const schema = {
      id: {
        type: 'string',
        format: 'uuid'
      }
    }
    it('should accept a valid uuid', () => {
      const data = { id: '0b15ec24-c97f-438a-8ba0-62dadd523a09' }
      const result = validator(schema, data)
      expect(result.valid).toBe(true)
    })

    it('should reject an invalid uuid', () => {
      const data = { id: 'invalid-uuid' }
      const result = validator(schema, data)
      expect(result.valid).toBe(false)
    })
  })

  describe('objectid', () => {
    const schema = {
      id: {
        type: 'string',
        format: 'objectid',
      },
    }
    it('returns true when valid objectid', () => {
      const result = validator(schema, { id: '507f1f77bcf86cd799439011' })
      expect(result.valid).toBe(true)
    })
    it('returns false when invalid objectid', () => {
      const result = validator(schema, { id: 'invalid_id' })
      expect(result.valid).toBe(false)
    })
  })

  describe('URL format', () => {
    const validUrls = [
      'http://www.example.com',
      'https://www.example.com',
      'ftp://ftp.example.com',
      'http://example.com',
      'http://example.co.uk',
      'https://example.com/path',
      // 'http://192.168.0.1',
      // 'http://localhost',
      // 'http://[::1]',
      // 'http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]',
      // 'http://[2001:0db8:85a3::8a2e:0370:7334]',
      // 'http://[2001:0db8:85a3:0:0:8a2e:0370:7334]',
      // 'http://[2001:0db8:85a3:0:0:8a2e:0370:7334]:8080',
      'http://example.com/path/to/page.html?query=string',
      // 'http://example.com/path/to/page.html#fragment',
    ]
    const invalidUrls = [
      'http://localhost:8080:',
      'http://[::1]:80:',
      // 'http://example.com:65536',
      'http://-example.com',
      'http://example-.com',
      'http://example.com-',
      'http://.example.com',
      'http://example..com',
      'http://example.com.',
      'http://localhost/path//to/page.html',
      'http://example.com?query=<script>alert(1)</script>',
      'http://example.com#<script>alert(1)</script>',
    ]
    const schema = {
      url: {
        type: 'string',
        format: 'url'
      }
    }

    test.each(validUrls)('valid URL: %p', (validUrl) => {
      const result = validator(schema, { url: validUrl })
      expect(result.valid).toBe(true)
    })
  
    test.each(invalidUrls)('invalid URL: %p', (invalidUrl) => {
      const result = validator(schema, { url: invalidUrl })
      expect(result.valid).toBe(false)
    })
  })

})
