// Dados de referência centralizados para toda a aplicação
// Este arquivo contém todas as informações de clientes, secções e departamentos

export const SECTIONS = {
  // Secções principais de produção
  'CF': { code: 'CF', name: 'Cozinha Fria', category: 'Produção' },
  'CQ': { code: 'CQ', name: 'Cozinha Quente', category: 'Produção' },
  'PAS': { code: 'PAS', name: 'Pastelaria', category: 'Produção' },
  'REF_PAS': { code: 'REF_PAS', name: 'Ref. Pastelaria', category: 'Produção' },
  'RPA': { code: 'RPA', name: 'Refeitório Pastelaria', category: 'Refeitório' },
  'RPL': { code: 'RPL', name: 'R.P.L. - Refeitório', category: 'Refeitório' },
  'RCQ': { code: 'RCQ', name: 'Ref. Cozinha Quente', category: 'Refeitório' },
  'RCF': { code: 'RCF', name: 'Refeitório Cozinha Fria', category: 'Refeitório' },
  
  // Secções operacionais
  'RP': { code: 'RP', name: 'Rouparia', category: 'Operacional' },
  'TSU': { code: 'TSU', name: 'Tray Setup', category: 'Operacional' },
  'WAP': { code: 'WAP', name: 'WASH & PACK', category: 'Operacional' },
  'CRC': { code: 'CRC', name: 'Cargas Consumíveis', category: 'Operacional' },
  'NHU': { code: 'NHU', name: 'NHUB', category: 'Operacional' },
  'OBR': { code: 'OBR', name: 'Vending', category: 'Operacional' },
  'OPS': { code: 'OPS', name: 'Operações', category: 'Operacional' },
  'COP': { code: 'COP', name: 'Copa', category: 'Operacional' },
  'CRG': { code: 'CRG', name: 'CARGAS', category: 'Operacional' },
  
  // Armazéns e clientes
  'AC': { code: 'AC', name: 'Armazém de Clientes - CateringPor', category: 'Armazém' },
  'CT': { code: 'CT', name: 'Cateringpor', category: 'Armazém' },
  'FF': { code: 'FF', name: 'FrigoFril', category: 'Armazém' },
  'GY': { code: 'GY', name: 'Greenyard', category: 'Armazém' },
  'TP_AC': { code: 'TP_AC', name: 'TAP_Armazém Clientes', category: 'Armazém' },
  
  // Estados especiais CateringPor
  'CT_CADUCAD': { code: 'CT_CADUCAD', name: 'Cateringpor - Caducados', category: 'Estado Especial' },
  'CT_CHARTER': { code: 'CT_CHARTER', name: 'Cateringpor - Charters', category: 'Estado Especial' },
  'CT_DANIFIC': { code: 'CT_DANIFIC', name: 'Cateringpor - Danificados', category: 'Estado Especial' },
  'CT_DEVOL': { code: 'CT_DEVOL', name: 'Cateringpor - Devolução', category: 'Estado Especial' },
  'CT_QUARENT': { code: 'CT_QUARENT', name: 'Cateringpor - Quarentena', category: 'Estado Especial' },
  'CT_REJEIT': { code: 'CT_REJEIT', name: 'Cateringpor - Rejeitados', category: 'Estado Especial' },
  'CT_STANDBY': { code: 'CT_STANDBY', name: 'Cateringpor - Stand By', category: 'Estado Especial' },
  
  // Estados especiais FrigoFril
  'FF_STANDBY': { code: 'FF_STANDBY', name: 'FrigoFril Stand By', category: 'Estado Especial' },
  'FF_CADUCAD': { code: 'FF_CADUCAD', name: 'FrigoFril - Caducados', category: 'Estado Especial' },
  'FF_DANIFIC': { code: 'FF_DANIFIC', name: 'FrigoFril - Danificados', category: 'Estado Especial' },
  'FF_DEVOL': { code: 'FF_DEVOL', name: 'FrigoFril - Devolução', category: 'Estado Especial' },
  'FF_QUARENT': { code: 'FF_QUARENT', name: 'FrigoFril_QUARENTENA', category: 'Estado Especial' },
  'FF_REJEIT': { code: 'FF_REJEIT', name: 'Frigofril - Rejeitados', category: 'Estado Especial' },
  
  // Estados especiais Greenyard
  'GY_QUARENT': { code: 'GY_QUARENT', name: 'Greenyard - Quarentena', category: 'Estado Especial' },
  'GY_REJEIT': { code: 'GY_REJEIT', name: 'Greenyard - Rejeitados', category: 'Estado Especial' },
  
  // Entreposto Aduaneiro
  'EA_AEROFLO': { code: 'EA_AEROFLO', name: 'Entreposto Aduaneiro AEROFLOT', category: 'Entreposto Aduaneiro' },
  'EA_AMERICA': { code: 'EA_AMERICA', name: 'Entreposto Aduaneiro AMERICAN AIR', category: 'Entreposto Aduaneiro' },
  'EA_ASIANA': { code: 'EA_ASIANA', name: 'Entreposto Aduaneiro ASIANA', category: 'Entreposto Aduaneiro' },
  'EA_AZUL': { code: 'EA_AZUL', name: 'Entreposto Aduaneiro AZUL', category: 'Entreposto Aduaneiro' },
  'EA_CANADA': { code: 'EA_CANADA', name: 'Entreposto Aduaneiro AIRCANADA', category: 'Entreposto Aduaneiro' },
  'EA_CTP': { code: 'EA_CTP', name: 'Entreposto Aduaneiro CATERINGPOR', category: 'Entreposto Aduaneiro' },
  'EA_DELTA': { code: 'EA_DELTA', name: 'Entreposto Aduaneiro DELTA AIRLIN', category: 'Entreposto Aduaneiro' },
  'EA_EF_VOO': { code: 'EA_EF_VOO', name: 'Entreposto Aduaneiro e Fiscal VOO', category: 'Entreposto Aduaneiro' },
  'EA_EK': { code: 'EA_EK', name: 'Entreposto Aduaneiro EK', category: 'Entreposto Aduaneiro' },
  'EA_ETIHAD': { code: 'EA_ETIHAD', name: 'Entreposto Aduaneiro ETIHAD', category: 'Entreposto Aduaneiro' },
  'EA_LAM': { code: 'EA_LAM', name: 'Entreposto Aduaneiro LAM', category: 'Entreposto Aduaneiro' },
  'EA_LATAM': { code: 'EA_LATAM', name: 'Entreposto Aduaneiro LATAM', category: 'Entreposto Aduaneiro' },
  'EA_MS': { code: 'EA_MS', name: 'Entreposto Aduaneiro MS', category: 'Entreposto Aduaneiro' },
  'EA_QUARENT': { code: 'EA_QUARENT', name: 'Entreposto Aduaneiro CATERINGPOR - Quarentena', category: 'Entreposto Aduaneiro' },
  'EA_REJEIT': { code: 'EA_REJEIT', name: 'Entreposto Aduaneiro CATERINGPOR - Rejeitados', category: 'Entreposto Aduaneiro' },
  'EA_TAAG': { code: 'EA_TAAG', name: 'Entreposto Aduaneiro TAAG', category: 'Entreposto Aduaneiro' },
  'EAKE': { code: 'EAKE', name: 'Entreposto Aduaneiro KOREAN AIR', category: 'Entreposto Aduaneiro' },
  
  // Entreposto Fiscal
  'EF_AMERICA': { code: 'EF_AMERICA', name: 'Entreposto Fiscal AMERICAN', category: 'Entreposto Fiscal' },
  'EF_AZUL': { code: 'EF_AZUL', name: 'Entreposto Fiscal AZUL', category: 'Entreposto Fiscal' },
  'EF_DELTA': { code: 'EF_DELTA', name: 'Entreposto Fiscal DELTA', category: 'Entreposto Fiscal' },
  'EF_EK': { code: 'EF_EK', name: 'Entreposto Fiscal EK', category: 'Entreposto Fiscal' },
  'EF_ETIHAD': { code: 'EF_ETIHAD', name: 'Entreposto Fiscal ETIHAD', category: 'Entreposto Fiscal' },
  'EF_LAM': { code: 'EF_LAM', name: 'Entreposto Fiscal LAM', category: 'Entreposto Fiscal' },
  'EF_LATAM': { code: 'EF_LATAM', name: 'Entreposto Fiscal LATAM', category: 'Entreposto Fiscal' },
  'EF_TAP': { code: 'EF_TAP', name: 'Entreposto Fiscal Cateringpor EFI PT50282211201', category: 'Entreposto Fiscal' },
  
  // Outros serviços
  'EM': { code: 'EM', name: 'Economato', category: 'Serviços' },
  'EST': { code: 'EST', name: 'Equipamento', category: 'Serviços' },
  'ESU': { code: 'ESU', name: 'Equip. Set Up', category: 'Serviços' },
  'FARDAMENTO': { code: 'FARDAMENTO', name: 'Fardamento', category: 'Serviços' },
  'TRP': { code: 'TRP', name: 'Transportes', category: 'Serviços' },
  'DONATIVOS': { code: 'DONATIVOS', name: 'Donativos', category: 'Serviços' },
  
  // OBR específicos
  'OBR_GR': { code: 'OBR_GR', name: 'OBR_GATERETAIL', category: 'OBR' },
  'OBR_S4': { code: 'OBR_S4', name: 'OBR_SATA', category: 'OBR' },
  'PIC': { code: 'PIC', name: 'Serv. Recolha Sandes OBR', category: 'OBR' },
  
  // Localização específica
  'SJT': { code: 'SJT', name: 'FrigoFrill - São João da Talha', category: 'Localização' },
  
  // Teste/desenvolvimento
  'TEST': { code: 'TEST', name: 'Test 27-mar', category: 'Desenvolvimento' },
  'TESTE': { code: 'TESTE', name: 'Congelados 1', category: 'Desenvolvimento' },
  
  // Genérico
  'OUTROS': { code: 'OUTROS', name: 'Outros', category: 'Genérico' }
};

export const DEPARTMENTS = {
  // Congelados
  'C1': { code: 'C1', name: 'Congelados C1', mainCategory: 'Congelados', description: 'Câmara de Congelados 1' },
  'C2': { code: 'C2', name: 'Congelados C2', mainCategory: 'Congelados', description: 'Câmara de Congelados 2' },
  'C3': { code: 'C3', name: 'Congelados C3', mainCategory: 'Congelados', description: 'Câmara de Congelados 3' },
  'C4': { code: 'C4', name: 'Congelados C4', mainCategory: 'Congelados', description: 'Câmara de Congelados 4' },
  
  // Praça (Fresh & Vegetables)
  'P': { code: 'P', name: 'PRAÇA', mainCategory: 'PRAÇA', description: 'Produtos frescos e vegetais' },
  'PRACA': { code: 'PRACA', name: 'PRAÇA', mainCategory: 'PRAÇA', description: 'Produtos frescos e vegetais' },
  'F&V': { code: 'F&V', name: 'F&V, Pão & Iogurtes', mainCategory: 'PRAÇA', description: 'Frutas, Vegetais, Pão e Iogurtes' },
  
  // Refrigerados
  'R': { code: 'R', name: 'Refrigerados', mainCategory: 'Refrigerados', description: 'Produtos refrigerados gerais' },
  'R4': { code: 'R4', name: 'Refrigerados R4', mainCategory: 'Refrigerados', description: 'Câmara de Refrigerados 4' },
  
  // Secos/Ambiente
  'S': { code: 'S', name: 'Secos', mainCategory: 'Secos', description: 'Produtos secos/ambiente' },
  'Seco': { code: 'Seco', name: 'Seco', mainCategory: 'Secos', description: 'Produtos secos' },
  'Secos': { code: 'Secos', name: 'Secos', mainCategory: 'Secos', description: 'Produtos secos' },
  'AMB': { code: 'AMB', name: 'Ambiente', mainCategory: 'Secos', description: 'Temperatura ambiente' },
  
  // Consumíveis
  'DRG_AG': { code: 'DRG_AG', name: 'Consumíveis DRG_AG', mainCategory: 'Consumíveis', description: 'Drogaria - Água e Gelo' },
  'DRG_LIMP': { code: 'DRG_LIMP', name: 'Consumíveis DRG_LIMP', mainCategory: 'Consumíveis', description: 'Drogaria - Limpeza' },
  'FARDAMENTO': { code: 'FARDAMENTO', name: 'Fardamento', mainCategory: 'Consumíveis', description: 'Uniformes e vestuário' },
  'DRG_COPA': { code: 'DRG_COPA', name: 'Consumíveis DRG_COPA', mainCategory: 'Consumíveis', description: 'Drogaria - Copa' },
  'ECONOMATO': { code: 'ECONOMATO', name: 'Economato', mainCategory: 'Consumíveis', description: 'Produtos de economato' }
};

export const CLIENTS = {
  'C000001': { number: 'C000001', code: 'AC', name: 'Air Canada', hasCode: true },
  'C000002': { number: 'C000002', code: 'AF', name: 'Air France', hasCode: true },
  'C000003': { number: 'C000003', code: 'AA', name: 'American Airlines', hasCode: true },
  'C000004': { number: 'C000004', code: 'OZ', name: 'Asiana Airlines, Inc.', hasCode: true },
  'C000005': { number: 'C000005', code: 'AD', name: 'Azul Linhas Aéreas Brasileiras, SA', hasCode: true },
  'C000006': { number: 'C000006', code: 'BA', name: 'British Airways', hasCode: true },
  'C000007': { number: 'C000007', code: 'SN', name: 'Brussels Airlines', hasCode: true },
  'C000008': { number: 'C000008', code: 'CLIMEX', name: 'Climex', hasCode: true },
  'C000009': { number: 'C000009', code: 'CFNL', name: 'Consumidor Final', hasCode: true },
  'C000010': { number: 'C000010', code: 'DL', name: 'Delta Airlines', hasCode: true },
  'C000011': { number: 'C000011', code: 'EK', name: 'Emirates Airlines', hasCode: true },
  'C000012': { number: 'C000012', code: 'MMZ', name: 'EuroAtlantic Airways', hasCode: true },
  'C000013': { number: 'C000013', code: 'GF', name: 'Groundforce Edifícios', hasCode: true },
  'C000014': { number: 'C000014', code: '5K', name: 'HIFLY', hasCode: true },
  'C000015': { number: 'C000015', code: 'JAL', name: 'Japan Airlines Co. Ltd.', hasCode: true },
  'C000016': { number: 'C000016', code: 'JJ', name: 'TAM Linhas Aéreas, SA - Sucursal Portugal', hasCode: true },
  'C000017': { number: 'C000017', code: 'LH', name: 'Lufthansa', hasCode: true },
  'C000018': { number: 'C000018', code: 'LHZ', name: 'Lufthansa Outras Aéreas', hasCode: true },
  'C000019': { number: 'C000019', code: 'DGM', name: 'DGM - Manutenção TAP', hasCode: true },
  'C000020': { number: 'C000020', code: 'NGF', name: 'Navigator Groundforce', hasCode: true },
  'C000021': { number: 'C000021', code: 'NGF', name: 'Navigator TAP', hasCode: true },
  'C000022': { number: 'C000022', code: 'REF', name: 'Refeitório/Cafetaria', hasCode: true },
  'C000023': { number: 'C000023', code: 'SAFE', name: 'Safeport Executive', hasCode: true },
  'C000024': { number: 'C000024', code: 'S4', name: 'Sata Internacional', hasCode: true },
  'C000025': { number: 'C000025', code: 'SPDH', name: 'SPDH Assistência Voos', hasCode: true },
  'C000026': { number: 'C000026', code: 'DGT', name: 'Staff DGT', hasCode: true },
  'C000027': { number: 'C000027', code: 'SUPCH', name: 'Supply Chain', hasCode: true },
  'C000028': { number: 'C000028', code: 'DT', name: 'TAAG Linhas Aéreas de Angola', hasCode: true },
  'C000029': { number: 'C000029', code: 'TP', name: 'TAP Portugal', hasCode: true },
  'C000030': { number: 'C000030', code: '3V', name: 'TNT Airways, SA', hasCode: true },
  'C000031': { number: 'C000031', code: 'X3', name: 'Tuifly', hasCode: true },
  'C000032': { number: 'C000032', code: 'TPY', name: 'White Airways, SA', hasCode: true },
  'C000033': { number: 'C000033', code: 'AEROFLO', name: 'AEROFLOT - Linhas Aéreas Russas', hasCode: true },
  'C000034': { number: 'C000034', code: '939', name: 'GL Food Solutions, SA', hasCode: true },
  'C000035': { number: 'C000035', code: 'TRIU', name: 'TRIU Técnicas de Resíduos', hasCode: true },
  'C000036': { number: 'C000036', code: 'SITAVA', name: 'SITAVA Turismo, SA', hasCode: true },
  'C000037': { number: 'C000037', code: '1153', name: 'Esegur', hasCode: true },
  'C000038': { number: 'C000038', code: 'TA', name: 'TA - Terminal Tripulantes', hasCode: true },
  'C000039': { number: 'C000039', code: 'NI', name: 'Portugália', hasCode: true },
  'C000040': { number: 'C000040', code: 'MSC', name: 'MSC Cruises, SA', hasCode: true },
  'C000041': { number: 'C000041', code: 'OHY', name: 'OHAYOU LDA', hasCode: true },
  'C000042': { number: 'C000042', code: null, name: 'EVBOX B.V.', hasCode: false },
  'C000043': { number: 'C000043', code: null, name: 'TNT EXPRESS WORLDWIDE (PORTUGAL), TRANSITÁRIOS, TRANSPORTES E SERVIÇOS COMPLEMENTARES, UNIPESSOAL, LDA', hasCode: false },
  'C000044': { number: 'C000044', code: null, name: 'TAPGER - SOCIEDADE DE GESTÃO E SERVIÇOS S A', hasCode: false },
  'C000045': { number: 'C000045', code: null, name: 'ALULINE PORTUGAL DRENAGEM E TRATAMENTO DE AGUAS UNIPESSOAL LDA', hasCode: false },
  'C000046': { number: 'C000046', code: null, name: 'EUROLEVA - COMERCIO DE EQUIPAMENTOS DE ELEVAÇÃO S A', hasCode: false },
  'C000047': { number: 'C000047', code: null, name: 'LFP - LOJAS FRANCAS DE PORTUGAL, SA', hasCode: false },
  'C000048': { number: 'C000048', code: 'EVERTASTE PT', name: 'EVERTASTE LTD', hasCode: true },
  'C000051': { number: 'C000051', code: 'UCS', name: 'UCS CUIDADOS INTEGRADOS DE SAUDE SA', hasCode: true },
  'C000052': { number: 'C000052', code: null, name: 'MANUEL RUI AZINHAIS NABEIRO LDA', hasCode: false },
  'C000053': { number: 'C000053', code: 'RP', name: 'RANDPRIME UNIPESSOAL, LDA', hasCode: true },
  'C000054': { number: 'C000054', code: '8F', name: 'STP AIRWAYS SERVIÇ. TRANSP. AÉREOS S.TOMÉ PRÍNCIPE SARL', hasCode: true },
  'C000055': { number: 'C000055', code: 'FAP', name: 'ESTADO MAIOR FORCA AÉREA- DIR. ABASTE. E TRANSPORTES', hasCode: true },
  'C000056': { number: 'C000056', code: 'ET', name: 'ETHIOPIAN AIRLINES GROUP', hasCode: true },
  'C000057': { number: 'C000057', code: 'DT', name: 'TAAG LINHAS AÉREAS DE ANGOLA', hasCode: true },
  'C000058': { number: 'C000058', code: 'AR', name: 'AEROLINEAS ARGENTINAS S.A.', hasCode: true },
  'C000059': { number: 'C000059', code: 'TU', name: 'TUNISAIR', hasCode: true },
  'C000060': { number: 'C000060', code: 'GAF', name: 'GERMAN AIR FORCE', hasCode: true },
  'C000061': { number: 'C000061', code: 'OC', name: 'OMNI HANDLING SERVIÇO DE APOIO A AERONAVES, LDA', hasCode: true },
  'C000064': { number: 'C000064', code: 'HT', name: 'Air Horizont Limited', hasCode: true },
  'C000065': { number: 'C000065', code: 'UX', name: 'AIR EUROPA L.A., S.A.U.', hasCode: true },
  'C000066': { number: 'C000066', code: 'RF', name: 'RESTFLIGHT - SERVIÇOS DE CATERING, UNIPESSOAL, LDA', hasCode: true },
  'C000067': { number: 'C000067', code: 'GG', name: 'GATE GOURMET SWITZERLAND GmbH', hasCode: true },
  'C000068': { number: 'C000068', code: 'FH', name: 'FREEBIRD AIRLINES-HÜRKUS HAVAYOLU TASIMACILIK VE TICARET A.S.', hasCode: true },
  'C000069': { number: 'C000069', code: 'FAB', name: 'FORÇA AÉREA BRASILEIRA', hasCode: true },
  'C000070': { number: 'C000070', code: 'PS', name: 'UKRAINE INTERNATIONAL AIRLINES', hasCode: true },
  'C000071': { number: 'C000071', code: 'V3', name: 'CARPATAIR SA', hasCode: true },
  'C000072': { number: 'C000072', code: 'TK', name: 'TURKISH AIRLINES INC', hasCode: true },
  'C000073': { number: 'C000073', code: 'EMGFA', name: 'ESTADO MAIOR GERAL DAS FORÇAS ARMADAS', hasCode: true },
  'C000075': { number: 'C000075', code: '6Y', name: 'SMARTLYNX AIRLINES LTD', hasCode: true },
  'C000076': { number: 'C000076', code: 'ISS', name: 'ISS FACILITY SERVICES - GESTÃO E MANUTENÇAO DE EDIFICIOS LDA', hasCode: true },
  'C000077': { number: 'C000077', code: '5M', name: 'HIFLY LDA', hasCode: true },
  'C000078': { number: 'C000078', code: 'D T', name: 'TAAG ANGOLA AIRLINES, LUANDA', hasCode: true },
  'C000079': { number: 'C000079', code: 'ICTS', name: 'ICTS PORTUGAL', hasCode: true },
  'C000080': { number: 'C000080', code: 'CLA', name: 'C.L.A. - CATERING LINHAS AÉREAS, SA', hasCode: true },
  'C000081': { number: 'C000081', code: 'BPI', name: 'BANCO BPI, SA', hasCode: true },
  'C000082': { number: 'C000082', code: 'C A', name: 'CASA ANGOLA INTERNACIONAL-IMPORTAÇÃO E EXPORTAÇÃO, SA', hasCode: true },
  'C000083': { number: 'C000083', code: 'Q H', name: 'QUALHOUSE - PRODUTOS ALIMENTARES , UNIPESSOAL, LDA', hasCode: true },
  'C000084': { number: 'C000084', code: null, name: 'TRAILER CONSTRUCTION AND REPAIRING IBERICA SAU', hasCode: false },
  'C000085': { number: 'C000085', code: 'TCR', name: 'TCR INTERNATIONAL NV', hasCode: true },
  'C000086': { number: 'C000086', code: 'DL', name: 'DELTA AIR LINES, INC', hasCode: true },
  'C000087': { number: 'C000087', code: null, name: 'STAMEN- DISTRIBUIÇÃO DE PRODUTOS ALIMENTARES, LDA', hasCode: false },
  'C000088': { number: 'C000088', code: 'SW', name: 'SUMMERWIND PT', hasCode: true },
  'C000089': { number: 'C000089', code: 'SP', name: 'SAMSIC PORTUGAL- FACILITY SERVICES, S.A', hasCode: true },
  'C000090': { number: 'C000090', code: 'IBERLIM', name: 'IBERLIM - HIGIENE E SUSTENTABILIDADE AMBIENTAL, SA', hasCode: true },
  'C000091': { number: 'C000091', code: 'EY', name: 'ETIHAD AIRWAYS PJSC', hasCode: true },
  'C000092': { number: 'C000092', code: 'FRIGOFRIL', name: 'FRIGOFRIL-FRIO E TRANSPORTES LDA', hasCode: true },
  'C000093': { number: 'C000093', code: 'NB', name: 'NUNO DUARTE FERNANDES BATISTA', hasCode: true },
  'C000094': { number: 'C000094', code: 'VFS', name: 'VADECA FACILITY SERVICES', hasCode: true },
  'C000095': { number: 'C000095', code: 'M&M', name: 'MARÇAL & MARTINS-RESHAPE SOLUTIONS, LDA', hasCode: true },
  'C000096': { number: 'C000096', code: 'ONA', name: 'ORIOL NIÑO ASOCIADOS, SL', hasCode: true },
  'C000097': { number: 'C000097', code: 'LAM', name: 'LAM - LINHAS AÉREAS DE MOÇAMBIQUE', hasCode: true },
  'C000098': { number: 'C000098', code: 'AMBAAR', name: 'AMBAAR LOUNGE SERVICES, LDA', hasCode: true },
  'C000099': { number: 'C000099', code: 'BGR', name: 'BGR - GESTÃO DE RESÍDUOS, LDA.', hasCode: true },
  'C000100': { number: 'C000100', code: 'AMBIG', name: 'AMBIGROUP RESÍDUOS S.A.', hasCode: true },
  'C000101': { number: 'C000101', code: 'CACHA', name: 'CACHAPUZ- WEIGHING & LOGISTICS SYSTEMS, LDA', hasCode: true },
  'C000102': { number: 'C000102', code: 'UMN', name: 'UMN, LDA', hasCode: true },
  'C000103': { number: 'C000103', code: 'OU', name: 'CROATIA AIRLINES DD', hasCode: true },
  'C000104': { number: 'C000104', code: 'CFC', name: 'CANADIAN FORCES', hasCode: true },
  'C000105': { number: 'C000105', code: 'EVERTASTE PT', name: 'EVERTASTE LIMITED', hasCode: true },
  'C000106': { number: 'C000106', code: 'MS', name: 'EGYPTAIR LÍNEAS AÉREAS DE EGIPTO', hasCode: true },
  'C000108': { number: 'C000108', code: 'PTW', name: 'PORTWAY-HANDLING DE PORTUGAL, S.A.', hasCode: true },
  'C000109': { number: 'C000109', code: 'BLUEOTTER', name: 'BLUEOTTER CIRCULAR S.A', hasCode: true },
  'C000110': { number: 'C000110', code: 'KE', name: 'KOREAN AIRLINES CO. LTD., SUCURSAL EN ESPAÑA', hasCode: true },
  'C000111': { number: 'C000111', code: 'ULMA', name: 'ULMA PACKAGING, LDA', hasCode: true },
  'C000112': { number: 'C000112', code: 'KE', name: 'KOREAN AIRLINES CO. LTD.', hasCode: true },
  'C000113': { number: 'C000113', code: 'KE', name: 'KOREAN AIRLINES CO. LTD., SUCURSAL EN ESPAÑA', hasCode: true },
  'C000114': { number: 'C000114', code: 'GR', name: 'GATE GOURMET SWITZERLAND GmbH', hasCode: true },
  'C000115': { number: 'C000115', code: null, name: 'SWISS INTERNATIONAL AIR LINES LTD.', hasCode: false },
  'C999999': { number: 'C999999', code: 'C999999', name: 'Cliente Interno', hasCode: true }
};

// Funções utilitárias para busca e filtros
export const getSectionByCode = (code) => {
  return SECTIONS[code] || null;
};

export const getDepartmentByCode = (code) => {
  return DEPARTMENTS[code] || null;
};

export const getClientByNumber = (number) => {
  return CLIENTS[number] || null;
};

export const getClientByCode = (code) => {
  return Object.values(CLIENTS).find(client => client.code === code) || null;
};

export const getSectionsByCategory = (category) => {
  return Object.values(SECTIONS).filter(section => section.category === category);
};

export const getDepartmentsByMainCategory = (mainCategory) => {
  return Object.values(DEPARTMENTS).filter(dept => dept.mainCategory === mainCategory);
};

export const getClientsWithCode = () => {
  return Object.values(CLIENTS).filter(client => client.hasCode);
};

export const getClientsWithoutCode = () => {
  return Object.values(CLIENTS).filter(client => !client.hasCode);
};

// Arrays para uso em dropdowns/selects
export const SECTION_OPTIONS = Object.values(SECTIONS).map(section => ({
  value: section.code,
  label: `${section.code} - ${section.name}`,
  category: section.category
}));

export const DEPARTMENT_OPTIONS = Object.values(DEPARTMENTS).map(dept => ({
  value: dept.code,
  label: `${dept.code} - ${dept.name}`,
  category: dept.mainCategory
}));

export const CLIENT_OPTIONS = Object.values(CLIENTS).map(client => ({
  value: client.number,
  label: client.hasCode 
    ? `${client.code} - ${client.name}` 
    : `${client.number} - ${client.name}`,
  code: client.code,
  hasCode: client.hasCode
}));

// Categorias para organização
export const SECTION_CATEGORIES = [
  'Produção',
  'Refeitório', 
  'Operacional',
  'Armazém',
  'Estado Especial',
  'Entreposto Aduaneiro',
  'Entreposto Fiscal',
  'Serviços',
  'OBR',
  'Localização',
  'Desenvolvimento',
  'Genérico'
];

export const DEPARTMENT_CATEGORIES = [
  'Congelados',
  'PRAÇA',
  'Refrigerados',
  'Secos',
  'Consumíveis'
];

export default {
  SECTIONS,
  DEPARTMENTS,
  CLIENTS,
  getSectionByCode,
  getDepartmentByCode,
  getClientByNumber,
  getClientByCode,
  getSectionsByCategory,
  getDepartmentsByMainCategory,
  getClientsWithCode,
  getClientsWithoutCode,
  SECTION_OPTIONS,
  DEPARTMENT_OPTIONS,
  CLIENT_OPTIONS,
  SECTION_CATEGORIES,
  DEPARTMENT_CATEGORIES
};
