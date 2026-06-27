import React, { useState } from 'react';
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import html2canvas from 'html2canvas';

export interface ChartDownloadButtonProps {
  chartRef: React.RefObject<HTMLElement | null> | string;
  filename?: string;
  buttonSx?: any;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
}

/**
 * Downloads the referenced chart element as a PNG or JPG image.
 */
export const ChartDownloadButton: React.FC<ChartDownloadButtonProps> = ({
  chartRef,
  filename = 'chart',
  buttonSx = {},
  size = 'small',
  backgroundColor = '#ffffff',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const getChartElement = (): HTMLElement | null => {
    if (typeof chartRef === 'string') {
      return document.getElementById(chartRef);
    }
    return chartRef.current;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const downloadChart = async (format: 'png' | 'jpg') => {
    setIsDownloading(true);

    try {
      const element = getChartElement();

      if (!element) {
        throw new Error('Chart element not found');
      }

      const canvas = await html2canvas(element, {
        backgroundColor,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        removeContainer: true,
        imageTimeout: 15000,
      });

      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error('Failed to create image'));
            }
          },
          mimeType,
          0.95,
        );
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${filename}.${format}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      handleClose();
    } catch (error) {
      console.error('Error downloading chart:', error);
      window.alert('Error downloading chart. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Tooltip title="Download Chart">
        <IconButton
          onClick={(event) => setAnchorEl(event.currentTarget)}
          size={size}
          disabled={isDownloading}
          sx={{
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.lighter',
            },
            ...buttonSx,
          }}
        >
          {isDownloading
            ? <CircularProgress size={20} />
            : <DownloadIcon fontSize={size} />}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => downloadChart('png')} disabled={isDownloading}>
          <ListItemIcon>
            <ImageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download as PNG</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => downloadChart('jpg')} disabled={isDownloading}>
          <ListItemIcon>
            <ImageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download as JPG</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ChartDownloadButton;
