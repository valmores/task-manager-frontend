"use client";

import React, { useState } from 'react';
import { Button, Tooltip, CircularProgress } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Project } from '@/types/task';
import { getProjectTasks } from '@/lib/services/task-service';
import { generateProjectPdf } from '@/lib/utils/generate-project-pdf';

interface ExportPdfButtonProps {
  project: Project;
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({ project }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (e: React.MouseEvent) => {
    // Prevent event bubbling so the card click action isn't triggered
    e.stopPropagation();

    setIsExporting(true);
    try {
      // Lazy fetch the tasks related to this project
      const tasks = await getProjectTasks(project.id);
      // Generate and download PDF
      await generateProjectPdf(project, tasks);
    } catch (error) {
      console.error('Failed to generate project report PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Tooltip title="Export Project PDF Report">
      <span>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={handleExport}
          disabled={isExporting}
          startIcon={
            isExporting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <PictureAsPdfIcon fontSize="small" />
            )
          }
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 1.5,
            px: 1.5,
            py: 0.5,
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(0, 118, 255, 0.15)',
            },
          }}
        >
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </Button>
      </span>
    </Tooltip>
  );
};

