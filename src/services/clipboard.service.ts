import copy from 'copy-to-clipboard';

class ClipboardService {
    copy(text: string) {
        console.log('copy', copy);
        copy(text);
    }
}

export const clipBoardService = new ClipboardService();