import React, { useState } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Tooltip, 
  CircularProgress,
  ListItemIcon,
  ListItemText 
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import html2canvas from 'html2canvas';

export interface ChartDownloadButtonProps {
  /**
   * DOM element reference or ID to capture
   */
  chartRef: React.RefObject<HTMLElement | null> | string;
  
  /**
   * Filename for the downloaded file (without extension)
   */
  filename?: string;
  
  /**
   * Custom button styles
   */
  buttonSx?: any;
  
  /**
   * Size of the icon button
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Background color for the captured image
   */
  backgroundColor?: string;
}

/**
 * Chart Download Button Component
 * Provides options to download charts as PNG or JPG
 */
export const ChartDownloadButton: React.FC<ChartDownloadButtonProps> = ({
  chartRef,
  filename = 'chart',
  buttonSx = {},
  size = 'small',
  backgroundColor = '#ffffff'
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Get the DOM element to capture
   */
  const getChartElement = (): HTMLElement | null => {
    if (typeof chartRef === 'string') {
      return document.getElementById(chartRef);
    }
    return chartRef.current;
  };

  /**
   * Download chart as image
   */
  const downloadChart = async (format: 'png' | 'jpg') => {
    try {
      setIsDownloading(true);
      const element = getChartElement();
      
      if (!element) {
        console.error('Chart element not found');
        alert('Error: Chart element not found');
        return;
      }

      // Capture the element with html2canvas
      const canvas = await html2canvas(element, {
        backgroundColor: backgroundColor,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        removeContainer: true,
        imageTimeout: 15000
      });

      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          alert('Error: Failed to create image');
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${filename}.${format}`;
        link.href = url;
        link.click();

        // Cleanup
        URL.revokeObjectURL(url);
        setIsDownloading(false);
        handleClose();
      }, format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95);

    } catch (error) {
      console.error('Error downloading chart:', error);
      alert('Error downloading chart. Please try again.');
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Tooltip title="Download Chart">
        <IconButton
          onClick={handleClick}
          size={size}
          disabled={isDownloading}
          sx={{
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.lighter',
            },
            ...buttonSx
          }}
        >
          {isDownloading ? (
            <CircularProgress size={20} />
          ) : (
            <DownloadIcon fontSize={size} />
          )}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
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
