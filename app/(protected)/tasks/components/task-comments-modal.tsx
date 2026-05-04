"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Typography,
  Stack,
  Paper,
  CircularProgress,
  Avatar,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { Task } from "@/types/task";
import { useCreateNote } from "@/hooks/tasks/use-notes";
import { useAuthStore } from "@/store/useAuthStore";

interface TaskCommentsModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
}

export const TaskCommentsModal: React.FC<TaskCommentsModalProps> = ({ open, onClose, task }) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const createNoteMutation = useCreateNote();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [task?.notes, open]);

  const handleSend = async () => {
    if (!task || !input.trim() || createNoteMutation.isPending) return;

    try {
      await createNoteMutation.mutateAsync({
        task: task.id,
        content: input.trim(),
      });
      setInput("");
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{
        m: 0,
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #7c4dff 100%)`,
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Box>
          {/* <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Task Notes</Typography> */}
          <Typography variant="h6" sx={{ opacity: 0.8 }}>{task?.title}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{
        height: 400,
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f5f7fb',
        p: 2
      }}>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pr: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack spacing={2} sx={{ minHeight: "100%" }}>
            <Box sx={{ flex: 1 }} />
            {task?.notes && task.notes.length > 0 ? (
              [...task.notes].reverse().map((note) => {
                const isMe = note.author_email === user?.email;

                return (
                  <Box
                    key={note.id}
                    sx={{
                      display: "flex",
                      justifyContent: isMe ? "flex-end" : "flex-start",
                    }}
                  >
                    <Stack
                      direction={isMe ? "row-reverse" : "row"}
                      spacing={1}
                      sx={{ alignItems: "center", maxWidth: "85%" }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: "0.85rem",
                          bgcolor: isMe ? "primary.main" : "secondary.main",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        {getInitials(note.author_name)}
                      </Avatar>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: isMe ? "flex-end" : "flex-start",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            ml: isMe ? 0 : 1,
                            mr: isMe ? 1 : 0,
                            mb: 0.5,
                            fontWeight: 700,
                            color: isMe ? "primary.main" : "secondary.main",
                          }}
                        >
                          {isMe
                            ? "You"
                            : note.author_name.trim() || note.author_email}
                        </Typography>

                        <Paper
                          sx={{
                            p: 1.5,
                            bgcolor: isMe ? "primary.main" : "background.paper",
                            color: isMe ? "primary.contrastText" : "text.primary",
                            borderRadius: isMe
                              ? "16px 16px 4px 16px"
                              : "16px 16px 16px 4px",
                            boxShadow:
                              theme.palette.mode === "dark"
                                ? "0 4px 12px rgba(0,0,0,0.5)"
                                : "0 2px 8px rgba(0,0,0,0.08)",
                            border:
                              theme.palette.mode === "dark"
                                ? "1px solid"
                                : "none",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ whiteSpace: "pre-wrap" }}
                          >
                            {note.content}
                          </Typography>
                        </Paper>

                        <Typography
                          variant="caption"
                          sx={{
                            mt: 0.5,
                            px: 1,
                            color: "text.secondary",
                            fontSize: "0.65rem",
                          }}
                        >
                          {new Date(note.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                );
              })
            ) : (
              <Box sx={{ textAlign: "center", py: 4, opacity: 0.5 }}>
                <Typography variant="body2">
                  No internal notes yet.
                </Typography>
              </Box>
            )}

            <div ref={bottomRef} />
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={input}
          multiline
          maxRows={3}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={createNoteMutation.isPending}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />

        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!input.trim() || createNoteMutation.isPending}
          sx={{
            bgcolor: input.trim() ? 'primary.main' : 'transparent',
            color: input.trim() ? 'white' : 'primary.main',
            '&:hover': {
              bgcolor: input.trim() ? 'primary.dark' : 'rgba(99, 102, 241, 0.08)',
            },
            borderRadius: 2,
            p: 1
          }}
        >
          {createNoteMutation.isPending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};