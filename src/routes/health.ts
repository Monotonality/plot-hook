import { Router } from 'express';\nexport const healthRouter = Router();\nhealthRouter.get('/health', (_req, res) => {\n  res.json({ status: 'ok' });\n});\n
