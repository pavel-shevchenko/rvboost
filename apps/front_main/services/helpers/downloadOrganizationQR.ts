import { Location } from '@/services/typing/entities';
import { downloadZip, InputWithoutMeta } from 'client-zip';
import { getQrImageLink } from 'business/src/index';

export const downloadOrganizationQR = async (locations: Location[]) => {
  const files: Array<InputWithoutMeta> = [];
  for (const location of locations || []) {
    if (!location?.card?.shortLinkCode) continue;
    files.push({
      name: location.name + '.png',
      // @ts-ignore
      input: (await fetch(getQrImageLink(location?.card.shortLinkCode))).body
    });
  }
  // get the ZIP stream in a Blob
  const blob = await downloadZip(files).blob();
  // make and click a temporary link to download the Blob
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'QR.zip';
  link.click();
  // don't forget to revoke Blob URL
  URL.revokeObjectURL(link.href);
  link.remove();
};
