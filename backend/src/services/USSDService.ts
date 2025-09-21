import { UserRepository } from '../repositories/UserRepository';
import { MatchRepository } from '../repositories/MatchRepository';
import { TicketRepository } from '../repositories/TicketRepository';
import { TicketService } from './TicketService';

interface USSDResponse {
  message: string;
  continueSession: boolean;
  data?: any;
}

export class USSDService {
  private userRepository: UserRepository;
  private matchRepository: MatchRepository;
  private ticketRepository: TicketRepository;
  private ticketService: TicketService;

  constructor() {
    this.userRepository = new UserRepository();
    this.matchRepository = new MatchRepository();
    this.ticketRepository = new TicketRepository();
    this.ticketService = new TicketService();
  }

  async handleUSSDRequest(
    phoneNumber: string,
    text: string,
    sessionId: string
  ): Promise<USSDResponse> {
    const textArray = text.split('*');
    const level = textArray.length;

    // Main menu
    if (text === '') {
      return {
        message: `CON Welcome to Tiketi Rwanda
1. Buy Ticket
2. My Tickets
3. Check Balance
4. Register`,
        continueSession: true,
      };
    }

    // Level 1 responses
    switch (textArray[0]) {
      case '1':
        return this.handleBuyTicket(phoneNumber, textArray);
      case '2':
        return this.handleMyTickets(phoneNumber, textArray);
      case '3':
        return this.handleCheckBalance(phoneNumber);
      case '4':
        return this.handleRegistration(phoneNumber, textArray);
      default:
        return {
          message: 'END Invalid option. Please try again.',
          continueSession: false,
        };
    }
  }

  private async handleBuyTicket(
    phoneNumber: string,
    textArray: string[]
  ): Promise<USSDResponse> {
    // Level 1: Show available matches
    if (textArray.length === 1) {
      const matches = await this.matchRepository.findMatchesWithAvailableTickets();
      
      if (matches.length === 0) {
        return {
          message: 'END No matches available for ticket purchase.',
          continueSession: false,
        };
      }

      let message = 'CON Select a match:\n';
      matches.slice(0, 9).forEach((match, index) => {
        const dateStr = match.match_date.toLocaleDateString();
        message += `${index + 1}. ${match.getMatchTitle()} - ${dateStr} - ${match.ticket_price} RWF\n`;
      });

      return {
        message,
        continueSession: true,
        data: { matches: matches.slice(0, 9) },
      };
    }

    // Level 2: Confirm purchase
    if (textArray.length === 2) {
      const matchIndex = parseInt(textArray[1]) - 1;
      const matches = await this.matchRepository.findMatchesWithAvailableTickets();
      const selectedMatch = matches[matchIndex];

      if (!selectedMatch) {
        return {
          message: 'END Invalid match selection.',
          continueSession: false,
        };
      }

      return {
        message: `CON Confirm ticket purchase:
Match: ${selectedMatch.getMatchTitle()}
Date: ${selectedMatch.match_date.toLocaleString()}
Venue: ${selectedMatch.venue.name}
Price: ${selectedMatch.ticket_price} RWF

1. Confirm
2. Cancel`,
        continueSession: true,
        data: { selectedMatch },
      };
    }

    // Level 3: Process purchase
    if (textArray.length === 3) {
      if (textArray[2] === '1') {
        try {
          const user = await this.userRepository.findByPhoneNumber(phoneNumber);
          if (!user) {
            return {
              message: 'END Please register first by selecting option 4.',
              continueSession: false,
            };
          }

          const matches = await this.matchRepository.findMatchesWithAvailableTickets();
          const matchIndex = parseInt(textArray[1]) - 1;
          const selectedMatch = matches[matchIndex];

          const ticket = await this.ticketService.purchaseTicket({
            userId: user.id,
            matchId: selectedMatch.id,
            paymentMethod: 'USSD' as any,
            purchasePhone: phoneNumber,
          });

          return {
            message: `END Ticket purchased successfully!
Ticket Code: ${ticket.ticket_code}
Match: ${selectedMatch.getMatchTitle()}
Price: ${ticket.price} RWF

Please save your ticket code.`,
            continueSession: false,
          };
        } catch (error) {
          return {
            message: `END Purchase failed: ${error.message}`,
            continueSession: false,
          };
        }
      } else {
        return {
          message: 'END Purchase cancelled.',
          continueSession: false,
        };
      }
    }

    return {
      message: 'END Invalid option.',
      continueSession: false,
    };
  }

  private async handleMyTickets(
    phoneNumber: string,
    textArray: string[]
  ): Promise<USSDResponse> {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    
    if (!user) {
      return {
        message: 'END Please register first by selecting option 4.',
        continueSession: false,
      };
    }

    const tickets = await this.ticketRepository.findActiveTickets(user.id);
    
    if (tickets.length === 0) {
      return {
        message: 'END You have no active tickets.',
        continueSession: false,
      };
    }

    let message = 'CON Your active tickets:\n';
    tickets.slice(0, 5).forEach((ticket, index) => {
      const match = ticket.match;
      message += `${index + 1}. ${match.getMatchTitle()} - ${ticket.ticket_code}\n`;
    });
    
    message += '\nSelect ticket for details:';

    return {
      message,
      continueSession: true,
      data: { tickets: tickets.slice(0, 5) },
    };
  }

  private async handleCheckBalance(phoneNumber: string): Promise<USSDResponse> {
    const user = await this.userRepository.findByPhoneNumber(phoneNumber);
    
    if (!user) {
      return {
        message: 'END Please register first by selecting option 4.',
        continueSession: false,
      };
    }

    return {
      message: `END Your wallet balance: ${user.wallet_balance} RWF`,
      continueSession: false,
    };
  }

  private async handleRegistration(
    phoneNumber: string,
    textArray: string[]
  ): Promise<USSDResponse> {
    // Level 1: Ask for name
    if (textArray.length === 1) {
      return {
        message: 'CON Enter your full name:',
        continueSession: true,
      };
    }

    // Level 2: Process registration
    if (textArray.length === 2) {
      const fullName = textArray[1];
      
      if (fullName.length < 2) {
        return {
          message: 'END Please enter a valid full name.',
          continueSession: false,
        };
      }

      try {
        const existingUser = await this.userRepository.findByPhoneNumber(phoneNumber);
        
        if (existingUser) {
          return {
            message: 'END You are already registered.',
            continueSession: false,
          };
        }

        await this.userRepository.createUSSDUser(phoneNumber, fullName);
        
        return {
          message: `END Registration successful! Welcome ${fullName}. You can now buy tickets using this service.`,
          continueSession: false,
        };
      } catch (error) {
        return {
          message: 'END Registration failed. Please try again.',
          continueSession: false,
        };
      }
    }

    return {
      message: 'END Invalid input.',
      continueSession: false,
    };
  }
}