import { utils, write, read } from "xlsx";

const buildExcelDir = () => {
  const fs = wx.getFileSystemManager();
  const dirPath = `${wx.env.USER_DATA_PATH}/excels`;

  return new Promise((success, fail) => {
    fs.mkdir({ dirPath, success, fail });
  });
};

const writeExcelToDir = (data: string, filename: string) => {
  const fs = wx.getFileSystemManager();
  const filePath = `${wx.env.USER_DATA_PATH}/excels/${filename}.xlsx`;

  return new Promise((success, fail) => {
    fs.writeFile({ encoding: "base64", filePath, data, success, fail });
  });
};

export const removeExcelDir = () => {
  const fs = wx.getFileSystemManager();
  const dirPath = `${wx.env.USER_DATA_PATH}/excels`;

  return new Promise((success, fail) => {
    fs.rmdir({ dirPath, success, fail, recursive: true });
  });
};

export const checkIfExist = (filename: string) => {
  const fs = wx.getFileSystemManager();
  const filePath = `${wx.env.USER_DATA_PATH}/excels/${filename}.xlsx`;

  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
};

export const deleteExcelFile = (filename: string) => {
  const fs = wx.getFileSystemManager();
  const filePath = `${wx.env.USER_DATA_PATH}/excels/${filename}.xlsx`;

  return new Promise((success, fail) => {
    fs.unlink({ filePath, success, fail });
  });
};

export const saveAsUserData = async (filename: string, sheet: unknown[][]) => {
  const workSheet = utils.aoa_to_sheet(sheet);
  const workBook = utils.book_new();

  utils.book_append_sheet(workBook, workSheet);
  const data = write(workBook, { bookType: "xlsx", type: "base64" });

  try {
    await buildExcelDir();
  } catch (error: any) {
    if (!/exists/.test(error.errMsg)) throw error;
  }

  return writeExcelToDir(data, filename);
};

export const exportExcelFile = (filename: string) => {
  const { platform } = uni.getDeviceInfo();
  const filePath = `${wx.env.USER_DATA_PATH}/excels/${filename}.xlsx`;

  return new Promise((success, fail) => {
    if (!checkIfExist(filename)) return fail("not exist");

    if (/devtools/i.test(platform)) {
      return wx.openDocument({ filePath, success, fail });
    }

    if (/mac|windows/i.test(platform)) {
      return wx.saveFileToDisk({ filePath, success, fail });
    }

    return wx.shareFileMessage({
      filePath,
      success,
      fail: (err) => {
        if (/canceled/.test(err.errMsg)) return success(null);
        fail(err);
      },
    });
  });
};

export const readExcelFile = (filename: string) => {
  const filePath = `${wx.env.USER_DATA_PATH}/excels/${filename}.xlsx`;

  return new Promise<string[][]>((success, fail) => {
    const fs = wx.getFileSystemManager();
    fs.readFile({
      filePath,
      encoding: "base64",
      success: async (file) => {
        const workbook = read(file.data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = utils.sheet_to_json(worksheet, { header: 1 });
        success(data as string[][]);
      },
      fail,
    });
  });
};
