import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Project, Task } from '@/types/task';

/**
 * Generate a beautifully styled, premium project PDF report including task list,
 * detailed breakdown, and embedded signatures for completed tasks.
 */
export async function generateProjectPdf(project: Project, tasks: Task[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Premium Palette
  const colors = {
    primary: [26, 54, 93], // Deep Navy blue
    secondary: [74, 85, 104], // Slate Gray
    accent: [49, 130, 206], // Bright Blue
    background: [247, 250, 252], // Off-white
    border: [226, 232, 240], // Light Gray border
    text: [45, 55, 72], // Charcoal
  };

  // Helper to draw a sleek header & footer on each page
  const drawPageTemplate = (pageNum: number, totalPages: number) => {
    // Header line and title
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 8, pageWidth - margin, margin + 8);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text('PROJECT STATUS REPORT', margin, margin + 5);

    doc.setFont('Helvetica', 'normal');
    doc.text(new Date().toLocaleDateString(), pageWidth - margin - 20, margin + 5);

    // Footer
    doc.line(margin, pageHeight - margin - 8, pageWidth - margin, pageHeight - margin - 8);
    doc.setFontSize(8);
    doc.text('Task Manager System', margin, pageHeight - margin - 4);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin - 20, pageHeight - margin - 4);
  };

  // 1. PAGE 1: TITLE & COVER PAGE / PROJECT OVERVIEW
  // Top Banner
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(margin, 25, contentWidth, 35, 'F');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('PROJECT REPORT', margin + 8, 42);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(226, 232, 240);
  doc.text(`Generated on ${new Date().toLocaleString()}`, margin + 8, 50);

  // Project Info Table
  let currentY = 70;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('Project Information', margin, currentY);
  
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.setLineWidth(1);
  doc.line(margin, currentY + 2, margin + 15, currentY + 2);
  currentY += 8;

  // Metadata block
  const projectMetadata = [
    { label: 'Project Name:', value: project.name },
    { label: 'Description:', value: project.description || 'No description provided.' },
    { label: 'Created By:', value: project.created_by },
    { label: 'Creation Date:', value: new Date(project.created_at).toLocaleDateString() },
    { label: 'Total Tasks:', value: `${project.task_count || 0} tasks` },
  ];

  doc.setFontSize(10);
  projectMetadata.forEach((meta) => {
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text(meta.label, margin, currentY);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    
    // Multi-line wrap for description
    if (meta.label === 'Description:') {
      const splitText = doc.splitTextToSize(meta.value, contentWidth - 40);
      doc.text(splitText, margin + 40, currentY);
      currentY += splitText.length * 5;
    } else {
      doc.text(meta.value, margin + 40, currentY);
      currentY += 7;
    }
  });

  currentY += 10;

  // 2. TASK SUMMARY TABLE
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('Task Summary', margin, currentY);
  
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.setLineWidth(1);
  doc.line(margin, currentY + 2, margin + 15, currentY + 2);
  currentY += 8;

  // Compile tasks table data
  const tableHeaders = [['Title', 'Status', 'Priority', 'Assigned To', 'Signed']];
  const tableRows = tasks.map((task) => [
    task.title,
    task.status.toUpperCase().replace('_', ' '),
    task.priority.toUpperCase(),
    task.assigned_to_email || 'Unassigned',
    task.signature ? 'Yes' : 'No',
  ]);

  autoTable(doc, {
    startY: currentY,
    head: tableHeaders,
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: colors.primary as [number, number, number],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: colors.text as [number, number, number],
      fontSize: 9,
    },
    margin: { left: margin, right: margin },
  });

  // 3. PAGE 2+: TASK DETAILS
  tasks.forEach((task, index) => {
    doc.addPage();
    currentY = 32;

    // Header Card
    doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
    doc.rect(margin, currentY, contentWidth, 24, 'F');
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setLineWidth(0.5);
    doc.rect(margin, currentY, contentWidth, 24, 'S');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text(`TASK #${index + 1}: ${task.title}`, margin + 5, currentY + 8);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text(`Status: ${task.status.toUpperCase().replace('_', ' ')}  |  Priority: ${task.priority.toUpperCase()}`, margin + 5, currentY + 14);
    doc.text(`Assigned To: ${task.assigned_to_email || 'Unassigned'}`, margin + 5, currentY + 19);

    currentY += 32;

    // Task Description section
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text('Description', margin, currentY);
    currentY += 5;

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    const descText = task.description || 'No description provided.';
    const splitDesc = doc.splitTextToSize(descText, contentWidth);
    doc.text(splitDesc, margin, currentY);
    currentY += splitDesc.length * 5 + 10;

    // Internal Notes section (if exists)
    if (task.notes && task.notes.length > 0) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('Activity & Internal Notes', margin, currentY);
      currentY += 5;

      task.notes.forEach((note) => {
        // Draw small note card
        doc.setFillColor(255, 255, 255);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        doc.text(`${note.author_email} on ${new Date(note.created_at).toLocaleString()}:`, margin + 2, currentY);
        currentY += 4;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        const splitNoteContent = doc.splitTextToSize(note.content, contentWidth - 4);
        doc.text(splitNoteContent, margin + 2, currentY);
        currentY += splitNoteContent.length * 4.5 + 4;
      });

      currentY += 6;
    }

    // Signature Block section (only if completed and signature exists)
    if (task.signature) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('Completion Signature', margin, currentY);
      currentY += 5;

      // Draw dashed/solid box for the signature
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, currentY, 60, 24, 'FD');

      try {
        // Embed the base64 signature image. Add support for full dataurl format
        const sigBase64 = task.signature;
        doc.addImage(sigBase64, 'PNG', margin + 5, currentY + 2, 50, 20);
      } catch (err) {
        console.error('Failed to embed signature image in PDF:', err);
        doc.setFont('Helvetica', 'italic');
        doc.setFontSize(8);
        doc.text('[Signature Image Error]', margin + 10, currentY + 12);
      }

      // Metadata alongside the signature
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text('Signed Electronically', margin + 68, currentY + 8);
      
      doc.setFont('Helvetica', 'bold');
      doc.text(`Signer: ${task.assigned_to_email || task.created_by}`, margin + 68, currentY + 13);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      if (task.signed_at) {
        doc.text(`Signed At: ${new Date(task.signed_at).toLocaleString()}`, margin + 68, currentY + 18);
      }
    }
  });

  // Calculate pages and draw standard headers/footers
  const totalPages = doc.internal.pages.length - 1; // jsPDF has a dummy page 0
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageTemplate(i, totalPages);
  }

  // Trigger browser download
  const safeProjectName = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  doc.save(`project-report-${safeProjectName}.pdf`);
}
