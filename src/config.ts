import dotenv from 'dotenv'

dotenv.config()

// Personalize o diretório de dados ou a porta da api por meio de variáveis de ambiente
export const dataDir = process.env.DATA_DIR || 'data'
export const port = Number(process.env.PORT) || 3000

