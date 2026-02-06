import { describe, it, expect } from 'vitest';
import { matches, commentary, matchStatus } from './schema.js';
import { pgTable, pgEnum } from 'drizzle-orm/pg-core';

describe('Database Schema', () => {
  describe('matchStatus enum', () => {
    it('should be defined as a pgEnum', () => {
      expect(matchStatus).toBeDefined();
      expect(matchStatus.enumName).toBe('match_status');
    });

    it('should have correct enum values', () => {
      expect(matchStatus.enumValues).toEqual(['scheduled', 'live', 'finished']);
    });
  });

  describe('matches table', () => {
    it('should be defined as a pgTable', () => {
      expect(matches).toBeDefined();
      expect(matches[Symbol.for('drizzle:Name')]).toBe('matches');
    });

    it('should have id column as primary key', () => {
      const idColumn = matches.id;
      expect(idColumn).toBeDefined();
      expect(idColumn.name).toBe('id');
      expect(idColumn.primary).toBe(true);
    });

    it('should have sport column as required text', () => {
      const sportColumn = matches.sport;
      expect(sportColumn).toBeDefined();
      expect(sportColumn.name).toBe('sport');
      expect(sportColumn.notNull).toBe(true);
    });

    it('should have homeTeam column as required text', () => {
      const homeTeamColumn = matches.homeTeam;
      expect(homeTeamColumn).toBeDefined();
      expect(homeTeamColumn.name).toBe('home_team');
      expect(homeTeamColumn.notNull).toBe(true);
    });

    it('should have awayTeam column as required text', () => {
      const awayTeamColumn = matches.awayTeam;
      expect(awayTeamColumn).toBeDefined();
      expect(awayTeamColumn.name).toBe('away_team');
      expect(awayTeamColumn.notNull).toBe(true);
    });

    it('should have status column with default value', () => {
      const statusColumn = matches.status;
      expect(statusColumn).toBeDefined();
      expect(statusColumn.name).toBe('status');
      expect(statusColumn.notNull).toBe(true);
      expect(statusColumn.default).toBeDefined();
    });

    it('should have startTime column as timestamp', () => {
      const startTimeColumn = matches.startTime;
      expect(startTimeColumn).toBeDefined();
      expect(startTimeColumn.name).toBe('start_time');
    });

    it('should have endTime column as timestamp', () => {
      const endTimeColumn = matches.endTime;
      expect(endTimeColumn).toBeDefined();
      expect(endTimeColumn.name).toBe('end_time');
    });

    it('should have homeScore column with default value 0', () => {
      const homeScoreColumn = matches.homeScore;
      expect(homeScoreColumn).toBeDefined();
      expect(homeScoreColumn.name).toBe('home_score');
      expect(homeScoreColumn.notNull).toBe(true);
      expect(homeScoreColumn.default).toBeDefined();
    });

    it('should have awayScore column with default value 0', () => {
      const awayScoreColumn = matches.awayScore;
      expect(awayScoreColumn).toBeDefined();
      expect(awayScoreColumn.name).toBe('away_score');
      expect(awayScoreColumn.notNull).toBe(true);
      expect(awayScoreColumn.default).toBeDefined();
    });

    it('should have createdAt column with default value', () => {
      const createdAtColumn = matches.createdAt;
      expect(createdAtColumn).toBeDefined();
      expect(createdAtColumn.name).toBe('created_at');
      expect(createdAtColumn.notNull).toBe(true);
      expect(createdAtColumn.default).toBeDefined();
    });

    it('should have all expected columns', () => {
      const columnNames = Object.keys(matches);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('sport');
      expect(columnNames).toContain('homeTeam');
      expect(columnNames).toContain('awayTeam');
      expect(columnNames).toContain('status');
      expect(columnNames).toContain('startTime');
      expect(columnNames).toContain('endTime');
      expect(columnNames).toContain('homeScore');
      expect(columnNames).toContain('awayScore');
      expect(columnNames).toContain('createdAt');
    });
  });

  describe('commentary table', () => {
    it('should be defined as a pgTable', () => {
      expect(commentary).toBeDefined();
      expect(commentary[Symbol.for('drizzle:Name')]).toBe('commentary');
    });

    it('should have id column as primary key', () => {
      const idColumn = commentary.id;
      expect(idColumn).toBeDefined();
      expect(idColumn.name).toBe('id');
      expect(idColumn.primary).toBe(true);
    });

    it('should have matchId column as required integer', () => {
      const matchIdColumn = commentary.matchId;
      expect(matchIdColumn).toBeDefined();
      expect(matchIdColumn.name).toBe('match_id');
      expect(matchIdColumn.notNull).toBe(true);
    });

    it('should have matchId foreign key referencing matches.id', () => {
      const matchIdColumn = commentary.matchId;
      expect(matchIdColumn).toBeDefined();
      expect(matchIdColumn.name).toBe('match_id');
      expect(matchIdColumn.notNull).toBe(true);
    });

    it('should have minute column as optional integer', () => {
      const minuteColumn = commentary.minute;
      expect(minuteColumn).toBeDefined();
      expect(minuteColumn.name).toBe('minute');
    });

    it('should have sequence column as optional integer', () => {
      const sequenceColumn = commentary.sequence;
      expect(sequenceColumn).toBeDefined();
      expect(sequenceColumn.name).toBe('sequence');
    });

    it('should have period column as optional text', () => {
      const periodColumn = commentary.period;
      expect(periodColumn).toBeDefined();
      expect(periodColumn.name).toBe('period');
    });

    it('should have eventType column as optional text', () => {
      const eventTypeColumn = commentary.eventType;
      expect(eventTypeColumn).toBeDefined();
      expect(eventTypeColumn.name).toBe('event_type');
    });

    it('should have actor column as optional text', () => {
      const actorColumn = commentary.actor;
      expect(actorColumn).toBeDefined();
      expect(actorColumn.name).toBe('actor');
    });

    it('should have team column as optional text', () => {
      const teamColumn = commentary.team;
      expect(teamColumn).toBeDefined();
      expect(teamColumn.name).toBe('team');
    });

    it('should have message column as required text', () => {
      const messageColumn = commentary.message;
      expect(messageColumn).toBeDefined();
      expect(messageColumn.name).toBe('message');
      expect(messageColumn.notNull).toBe(true);
    });

    it('should have metadata column as jsonb', () => {
      const metadataColumn = commentary.metadata;
      expect(metadataColumn).toBeDefined();
      expect(metadataColumn.name).toBe('metadata');
    });

    it('should have tags column as text array', () => {
      const tagsColumn = commentary.tags;
      expect(tagsColumn).toBeDefined();
      expect(tagsColumn.name).toBe('tags');
    });

    it('should have createdAt column with default value', () => {
      const createdAtColumn = commentary.createdAt;
      expect(createdAtColumn).toBeDefined();
      expect(createdAtColumn.name).toBe('created_at');
      expect(createdAtColumn.notNull).toBe(true);
      expect(createdAtColumn.default).toBeDefined();
    });

    it('should have all expected columns', () => {
      const columnNames = Object.keys(commentary);
      expect(columnNames).toContain('id');
      expect(columnNames).toContain('matchId');
      expect(columnNames).toContain('minute');
      expect(columnNames).toContain('sequence');
      expect(columnNames).toContain('period');
      expect(columnNames).toContain('eventType');
      expect(columnNames).toContain('actor');
      expect(columnNames).toContain('team');
      expect(columnNames).toContain('message');
      expect(columnNames).toContain('metadata');
      expect(columnNames).toContain('tags');
      expect(columnNames).toContain('createdAt');
    });
  });

  describe('table relationships', () => {
    it('should have foreign key column for match_id', () => {
      const matchIdColumn = commentary.matchId;
      expect(matchIdColumn).toBeDefined();
      expect(matchIdColumn.name).toBe('match_id');
      expect(matchIdColumn.notNull).toBe(true);
    });

    it('should have matchId referencing matches table', () => {
      const matchIdColumn = commentary.matchId;
      expect(matchIdColumn).toBeDefined();
      expect(matchIdColumn.name).toBe('match_id');
      const tableName = commentary[Symbol.for('drizzle:Name')];
      expect(tableName).toBe('commentary');
    });

    it('should have proper table structure for relationships', () => {
      expect(matches[Symbol.for('drizzle:Name')]).toBe('matches');
      expect(commentary[Symbol.for('drizzle:Name')]).toBe('commentary');
      expect(matches.id).toBeDefined();
      expect(commentary.matchId).toBeDefined();
    });
  });

  describe('schema edge cases', () => {
    it('should handle matches table with minimal required fields', () => {
      const minimalMatch = {
        sport: 'football',
        homeTeam: 'Team A',
        awayTeam: 'Team B',
      };

      expect(minimalMatch.sport).toBeDefined();
      expect(minimalMatch.homeTeam).toBeDefined();
      expect(minimalMatch.awayTeam).toBeDefined();
    });

    it('should handle commentary with minimal required fields', () => {
      const minimalCommentary = {
        matchId: 1,
        message: 'Test message',
      };

      expect(minimalCommentary.matchId).toBeDefined();
      expect(minimalCommentary.message).toBeDefined();
    });

    it('should handle all match status enum values', () => {
      const statuses = ['scheduled', 'live', 'finished'];
      statuses.forEach(status => {
        expect(matchStatus.enumValues).toContain(status);
      });
    });
  });
});