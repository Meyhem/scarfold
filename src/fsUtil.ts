import fs from 'fs-extra'
import path from 'path'

export interface IFsUtil {
  loadFile(filePath: string): string
  gFileWrite(content: string, destPath: string): void
  exists(filePath: string): boolean
}

export class FsUtil implements IFsUtil {
  public loadFile(filePath: string): string {
    return fs.readFileSync(filePath, { encoding: 'utf-8' })
  }

  public gFileWrite(content: string, destPath: string): void {
    fs.mkdirpSync(path.dirname(destPath))
    fs.writeFileSync(destPath, content)
  }

  public exists(filePath: string): boolean {
    return fs.existsSync(filePath)
  }
}
