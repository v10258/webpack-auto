var Mock = require('mockjs')
import { REMOTE } from '../ajax.js'

export default function () {
  Mock.mock(new RegExp(REMOTE.find.relatedQuestions), {
    'success': true,
    'code': 200,
    'message': '',
    'data|10': [{}]
  })
}
