var Mock = require('mockjs')
import { REMOTE } from '../ajax.js'

export default function() {
  Mock.mock(new RegExp(REMOTE.index.queryQuestions), {
    'success': true,
    'code': 200,
    'message': '',
    'data': {}
  })
}




