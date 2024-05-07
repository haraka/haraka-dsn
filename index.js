'use strict'

// Enhanced Status Codes, see RFCs in README#References
const enum_status_codes = [
  [ // X.0.XXX Other or Undefined Status        (unspecified)
    "Other undefined status",                                   // X.0.0
  ],
  [ // X.1.XXX Addressing Status                (addr_*)
    "Other address status",                                     // X.1.0
    "Bad destination mailbox address",                          // X.1.1
    "Bad destination system address",                           // X.1.2
    "Bad destination mailbox address syntax",                   // X.1.3
    "Destination mailbox address ambiguous",                    // X.1.4
    "Destination address valid",                                // X.1.5
    "Destination mailbox has moved, No forwarding address",     // X.1.6
    "Bad sender's mailbox address syntax",                      // X.1.7
    "Bad sender's system address",                              // X.1.8
    "Message relayed to non-compliant mailer",                  // X.1.9
  ],
  [ // X.2.XXX Mailbox Status                   (mbox_*)
    "Other or undefined mailbox status",                        // X.2.0
    "Mailbox disabled, not accepting messages",                 // X.2.1
    "Mailbox full",                                             // X.2.2
    "Message length exceeds administrative limit",              // X.2.3
    "Mailing list expansion problem",                           // X.2.4
    ""
  ],
  [ // X.3.XXX Mail System Status               (sys_*)
    "Other or undefined mail system status",                    // X.3.0
    "Mail system full",                                         // X.3.1
    "System not accepting network messages",                    // X.3.2
    "System not capable of selected features",                  // X.3.3
    "Message too big for system",                               // X.3.4
    "System incorrectly configured",                            // X.3.5
  ],
  [ // X.4.XXX Network and Routing Status       (net_*)
    "Other or undefined network or routing status",             // X.4.0
    "No answer from host",                                      // X.4.1
    "Bad connection",                                           // X.4.2
    "Directory server failure",                                 // X.4.3
    "Unable to route",                                          // X.4.4
    "Mail system congestion",                                   // X.4.5
    "Routing loop detected",                                    // X.4.6
    "Delivery time expired",                                    // X.4.7
  ],
  [ // X.5.XXX Mail Delivery Protocol Status    (proto_*)
    "Other or undefined protocol status",                       // X.5.0
    "Invalid command",                                          // X.5.1
    "Syntax error",                                             // X.5.2
    "Too many recipients",                                      // X.5.3
    "Invalid command arguments",                                // X.5.4
    "Wrong protocol version",                                   // X.5.5
    "Authentication Exchange line is too long",                 // X.5.6
  ],
  [ // X.6.XXX Message Content or Media Status  (media_*)
    "Other or undefined media error",                           // X.6.0
    "Media not supported",                                      // X.6.1
    "Conversion required and prohibited",                       // X.6.2
    "Conversion required but not supported",                    // X.6.3
    "Conversion with loss performed",                           // X.6.4
    "Conversion failed",                                        // X.6.5
    "Message content not available",                            // X.6.6
  ],
  [ // X.7.XXX Security or Policy Status        (sec_*)
    "Authentication Succeeded",                                 // X.7.0
    "Delivery not authorized, message refused",                 // X.7.1
    "Mailing list expansion prohibited",                        // X.7.2
    "Security conversion required but not possible",            // X.7.3
    "Security features not supported",                          // X.7.4
    "Cryptographic failure",                                    // X.7.5
    "Cryptographic algorithm not supported",                    // X.7.6
    "Message integrity failure",                                // X.7.7
    "Authentication credentials invalid",                       // X.7.8
    "Authentication mechanism is too weak",                     // X.7.9
    "Encryption Needed",                                        // X.7.10
    "Encryption required for requested authentication mechanism", // X.7.11
    "A password transition is needed",                          // X.7.12
    "User Account Disabled",                                    // X.7.13
    "Trust relationship required",                              // X.7.14
  ]
];

class DSN {
  constructor (code, msg, def, subject, detail) {
    this.code = (/^[245]\d{2}/.exec(code)) ? code : null || def || 450;
    this.msg = msg;
    this.cls = parseInt(new String(this.code)[0]);
    this.sub = subject || 0;
    this.det = detail || 0;
    this.default_msg = ((enum_status_codes[this.sub]) ? enum_status_codes[this.sub][this.det] : '') || '';

    // multi-line replies
    if (Array.isArray(this.msg)) {
      this.reply = [];
      let m;
      while ((m = this.msg.shift())) {
        this.reply.push(`${[this.cls, this.sub, this.det].join('.')} ${m}`);
      }
      return
    }

    this.reply = `${[this.cls, this.sub, this.det].join('.')} ${this.msg || this.default_msg}`;
  }

  static create (code, msg, subject, detail) {
    return new DSN(code, msg, null, subject, detail);
  }

  static unspecified (msg, code) {                  return new DSN(code, msg, 450, 0, 0); }

  // addr_*
  static addr_unspecified (msg, code) {             return new DSN(code, msg, 450, 1, 0); }
  static addr_bad_dest_mbox (msg, code) {           return new DSN(code, msg, 550, 1, 1); }
  static no_such_user (msg, code) {                 return new DSN(code, msg || 'No such user', 550, 1, 1); }
  static addr_bad_dest_system (msg, code) {         return new DSN(code, msg, 550, 1, 2); }
  static addr_bad_dest_syntax (msg, code) {         return new DSN(code, msg, 550, 1, 3); }
  static addr_dest_ambigous (msg, code) {           return new DSN(code, msg, 450, 1, 4); }
  static addr_rcpt_ok (msg, code) {                 return new DSN(code, msg, 250, 1, 5); }
  static addr_mbox_moved (msg, code) {              return new DSN(code, msg, 550, 1, 6); }
  static addr_bad_from_syntax (msg, code) {         return new DSN(code, msg, 550, 1, 7); }
  static addr_bad_from_system (msg, code) {         return new DSN(code, msg, 550, 1, 8); }

  // mbox_*
  static mbox_unspecified (msg, code) {             return new DSN(code, msg, 450, 2, 0); }
  static mbox_disabled (msg, code) {                return new DSN(code, msg, 550, 2, 1); }
  static mbox_full (msg, code) {                    return new DSN(code, msg, 450, 2, 2); }
  static mbox_msg_too_long (msg, code) {            return new DSN(code, msg, 550, 2, 3); }
  static mbox_list_expansion_problem (msg, code) {  return new DSN(code, msg, 450, 2, 4); }

  // sys_*
  static sys_unspecified (msg, code) {              return new DSN(code, msg, 450, 3, 0); }
  static sys_disk_full (msg, code) {                return new DSN(code, msg, 450, 3, 1); }
  static sys_not_accepting_mail (msg, code) {       return new DSN(code, msg, 450, 3, 2); }
  static sys_not_supported (msg, code) {            return new DSN(code, msg, 450, 3, 3); }
  static sys_msg_too_big (msg, code) {              return new DSN(code, msg, 550, 3, 4); }
  static sys_incorrectly_configured (msg, code) {   return new DSN(code, msg, 450, 3, 5); }

  // net_*
  static net_unspecified (msg, code) {              return new DSN(code, msg, 450, 4, 0); }
  static net_no_answer (msg, code) {                return new DSN(code, msg, 450, 4, 1); }
  static net_bad_connection (msg, code) {           return new DSN(code, msg, 450, 4, 2); }
  static net_directory_server_failed (msg, code) {  return new DSN(code, msg, 450, 4, 3); }
  static temp_resolver_failed (msg, code) {         return new DSN(code, msg || 'Temporary address resolution failure', 450, 4, 3); }
  static net_unable_to_route (msg, code) {          return new DSN(code, msg, 550, 4, 4); }
  static net_system_congested (msg, code) {         return new DSN(code, msg, 450, 4, 5); }
  static net_routing_loop (msg, code) {             return new DSN(code, msg, 550, 4, 6); }
  static too_many_hops (msg, code) {                return new DSN(code, msg || 'Too many hops', 550, 4, 6); }
  static net_delivery_time_expired (msg, code) {    return new DSN(code, msg, 550, 4, 7); }

  // proto_*
  static proto_unspecified (msg, code) {            return new DSN(code, msg, 450, 5, 0); }
  static proto_invalid_command (msg, code) {        return new DSN(code, msg, 550, 5, 1); }
  static proto_syntax_error (msg, code) {           return new DSN(code, msg, 550, 5, 2); }
  static proto_too_many_rcpts (msg, code) {         return new DSN(code, msg, 450, 5, 3); }
  static proto_invalid_cmd_args (msg, code) {       return new DSN(code, msg, 550, 5, 4); }
  static proto_wrong_version (msg, code) {          return new DSN(code, msg, 450, 5, 5); }

  // media_*
  static media_unspecified (msg, code) {            return new DSN(code, msg, 450, 6, 0); }
  static media_unsupported (msg, code) {            return new DSN(code, msg, 550, 6, 1); }
  static media_conv_prohibited (msg, code) {        return new DSN(code, msg, 550, 6, 2); }
  static media_conv_unsupported (msg, code) {       return new DSN(code, msg, 450, 6, 3); }
  static media_conv_lossy (msg, code) {             return new DSN(code, msg, 450, 6, 4); }
  static media_conv_failed (msg, code) {            return new DSN(code, msg, 450, 6, 5); }

  // sec_*
  static sec_unspecified (msg, code) {              return new DSN(code, msg, 450, 7, 0); }
  static sec_unauthorized (msg, code) {             return new DSN(code, msg, 550, 7, 1); }
  static bad_sender_ip (msg, code) {                return new DSN(code, msg || 'Bad sender IP', 550, 7, 1); }
  static relaying_denied (msg, code) {              return new DSN(code, msg || 'Relaying denied', 550, 7, 1); }
  static sec_list_expn_prohibited (msg, code) {     return new DSN(code, msg, 550, 7, 2); }
  static sec_conv_failed (msg, code) {              return new DSN(code, msg, 550, 7, 3); }
  static sec_feature_unsupported (msg, code) {      return new DSN(code, msg, 550, 7, 4); }
  static sec_crypto_failure (msg, code) {           return new DSN(code, msg, 550, 7, 5); }
  static sec_crypto_algo_unsupported (msg, code) {  return new DSN(code, msg, 450, 7, 6); }
  static sec_msg_integrity_failure (msg, code) {    return new DSN(code, msg, 550, 7, 7); }

  // RFC4954
  static auth_succeeded (msg, code) {               return new DSN(code, msg, 235, 7, 0); }
  static auth_pass_transition_needed (msg, code) {  return new DSN(code, msg, 432, 7, 12); }
  static auth_temp_fail (msg, code) {               return new DSN(code, msg || 'Temporary authentication failure', 454, 7, 0); }
  static auth_too_weak (msg, code) {                return new DSN(code, msg, 534, 7, 9); }
  static auth_invalid (msg, code) {                 return new DSN(code, msg, 535, 7, 8); }
  static auth_exch_too_long (msg, code) {           return new DSN(code, msg, 500, 5, 6)}
  static auth_required (msg, code) {                return new DSN(code, msg || 'Authentication required', 530, 7, 0); }
  static auth_crypt_required (msg, code) {          return new DSN(code, msg, 538, 7, 11); }
}

module.exports = DSN
