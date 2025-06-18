'use client';

import styled from 'styled-components';

export const ThemeDatePickerContainer = styled.div`
  display: flex;
  width: fit-content;
  position: relative;
`;

export const CustomDatePickerButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 2rem;
  padding: 0 0.75rem;
  color: ${({ theme }) => theme.colors.gray[400]};
  gap: 0.25rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  border-radius: 0.5rem;
  font-size: 0.75rem;
  line-height: 0.75rem;
`;

export const CustomDatePicker = styled.div`
  display: flex;
  width: fit-content;
  height: fit-content;
  position: absolute;
  top: 3rem;
  right: 0;
  z-index: 99;

  /* Corrigido para .rdp (versão atual do react-day-picker) */
  .rdp {
    background: ${({ theme }) => theme.colors.gray[800]};
    border-radius: 0.5rem;
    padding: 1rem;

    .rdp-months {
      .rdp-nav {
        button {
          .rdp-chevron {
            fill: ${({ theme }) => theme.colors.primary.white};
          }
        }
      }

      .rdp-month {
        .rdp-caption {
          border-bottom: 1px solid ${({ theme }) => theme.colors.gray[700]};
          margin-bottom: 0.5rem;
        }

        .rdp-grid {
          tr {
            .rdp-range_start,
            .rdp-range_end {
              background: ${({ theme }) => theme.colors.gray[700]};
              border-radius: 0.25rem;

              button {
                background: ${({ theme }) => theme.colors.gradient.primary};
                color: ${({ theme }) => theme.colors.primary.white};
                border: none;
                border-radius: 0.25rem;
              }
            }

            .rdp-range_middle {
              background: ${({ theme }) => theme.colors.gray[700]};
            }

            .rdp-day.rdp-today {
              border-radius: 0.25rem;
              background: ${({ theme }) => theme.colors.gray[700]};
              color: ${({ theme }) => theme.colors.yellow[600]};
              font-weight: bold;
            }
          }
        }
      }
    }
  }
`;

export const CustomCloseButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -6px;
  right: -6px;
  color: ${({ theme }) => theme.colors.red[500]};
  border: 1px solid ${({ theme }) => theme.colors.red[500]};
  border-radius: 100%;
  min-width: 16px;
  min-height: 16px;
  font-size: 12px;
  line-height: 12px;
  z-index: 10;
`;
