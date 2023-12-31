import { utils, write } from 'xlsx';
import { useGlobalStore } from '@/stores/global';

function buildExcelDir() {
    const fs = wx.getFileSystemManager();
    const dirPath = `${wx.env.USER_DATA_PATH}/excels`;

    return new Promise((success, fail) => {
        fs.mkdir({ dirPath, success, fail });
    });
}

function writeExcelToDir(data: string, filename: string) {
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/excels/${filename}.xlsx`;

    return new Promise((success, fail) => {
        fs.writeFile({ encoding: 'base64', filePath, data, success, fail });
    });
}

export function removeExcelDir() {
    const fs = wx.getFileSystemManager();
    const dirPath = `${wx.env.USER_DATA_PATH}/excels`;

    return new Promise((success, fail) => {
        fs.rmdir({ dirPath, success, fail, recursive: true });
    });
}

export function checkIfExist(filename: string) {
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/excels/${filename}.xlsx`;

    try {
        fs.accessSync(filePath);
        return true;
    } catch {
        return false;
    }
}

export function deleteExcelFile(filename: string) {
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/excels/${filename}.xlsx`;

    return new Promise((success, fail) => {
        fs.unlink({ filePath, success, fail });
    });
}

export async function saveAsUserData(filename: string, sheet: unknown[][]) {
    const workSheet = utils.aoa_to_sheet(sheet);
    const workBook = utils.book_new();

    utils.book_append_sheet(workBook, workSheet);
    const data = write(workBook, { bookType: 'xlsx', type: 'base64' });

    try {
        await buildExcelDir();
    } catch (error: any) {
        if (!/exists/.test(error.errMsg)) throw error;
    }

    return writeExcelToDir(data, filename);
}

export function exportExcelFile(filename: string) {
    const { platform } = useGlobalStore();
    const filePath = `${wx.env.USER_DATA_PATH}/excels/${filename}.xlsx`;

    return new Promise((success, fail) => {
        if (!checkIfExist(filename)) return fail('not exist');

        if (/devtools/i.test(platform)) {
            return wx.openDocument({ filePath, success, fail });
        }

        if (/mac|windows/i.test(platform)) {
            return wx.saveFileToDisk({ filePath, success, fail });
        }

        return wx.shareFileMessage({
            filePath,
            success,
            fail: err => {
                if (/canceled/.test(err.errMsg)) return success(null);
                fail(err);
            },
        });
    });
}
