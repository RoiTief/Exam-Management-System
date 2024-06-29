import React from 'react';
import { Box, Typography, Divider, IconButton, Stack } from '@mui/material';
import { RemoveCircleOutline, DragHandle } from '@mui/icons-material';
import { EXAM } from '../../constants';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function QuestionList({ questions, removeQuestion, onDragEnd }) {
  return (
    questions.length > 0 && (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-questions">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              <Typography variant="h4" component="h2" gutterBottom>
                {EXAM.CREATED_QUESTIONS_HEADING}
              </Typography>
              {questions.map((question, index) => (
                <Draggable
                  key={`draggable-${question.id}-${question.key.text}`}
                  draggableId={`draggable-${question.id}-${question.key.text}`}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{ mb: 2 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ minWidth: '30px', mr: 2 }}>
                          <Typography variant="h6" component="h3">
                            {index + 1}.
                          </Typography>
                        </Box>
                        <Box
                          {...provided.dragHandleProps}
                          sx={{ cursor: 'grab', mr: 2 }}
                        >
                          <DragHandle />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          {question.appendix && (
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="subtitle1">
                                {EXAM.APPENDIX_TITLE} {question.appendix.title}
                              </Typography>
                              <Typography variant="body2">
                                {question.appendix.content}
                              </Typography>
                            </Box>
                          )}
                          <Typography variant="h6" component="h3">
                            {EXAM.QUESTION_HEADING}: {question.stem}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'baseline',
                              mt: 1,
                            }}
                          >
                            <Typography variant="body1" sx={{ minWidth: '80px' }}>
                              {EXAM.ANSWER_HEADING}:
                            </Typography>
                            <Typography variant="body2">
                              - {question.key.text}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'baseline',
                              mt: 1,
                            }}
                          >
                            <Typography variant="body1" sx={{ minWidth: '80px' }}>
                              {EXAM.DISTRACTORS_HEADING}:
                            </Typography>
                            <Box>
                              {question.distractors.map((d, i) => (
                                <Typography key={i} variant="body2">
                                  - {d.text}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                        <IconButton onClick={() => removeQuestion(index)} sx={{ mt: 2 }}>
                          <RemoveCircleOutline />
                        </IconButton>
                      </Box>
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    )
  );
}

export default QuestionList;
