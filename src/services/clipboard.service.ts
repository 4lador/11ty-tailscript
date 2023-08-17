import copyClipboard from 'copy-to-clipboard';

class ClipboardService {
    copy = (text: string) => copyClipboard(text);
}

export const clipBoardService = new ClipboardService();
