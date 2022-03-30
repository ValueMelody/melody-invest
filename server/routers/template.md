Organize router files based on this template
```
import { Router } from 'express'
import * as interfaces from '@shared/interfaces'
import * as crudTraders from '../services/crudTraders'
import * as errorEnum from '../enums/error'
import * as authMiddleware from '../middlewares/auth'

const templateRouter = Router()
export default templateRouter

// ------------------------------------------------------------ Validate --

const validateGetParams = () => {}

const validateCreateParams = () => {}

const validateUpdateParams = () => {}

const validateDeleteParams = () => {}

// ------------------------------------------------------------ Get --

templateRouter.get('/')

// ------------------------------------------------------------ Post --

templateRouter.post('/')

// ------------------------------------------------------------ Put --

templateRouter.put('/')

// ------------------------------------------------------------ Delete --

templateRouter.delete('/')

```