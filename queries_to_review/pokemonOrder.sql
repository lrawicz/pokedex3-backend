
-- 'typhlosion-hisui'
    UPDATE "Pokemon" SET "order" = "order" + 1 
        WHERE "order" > (SELECT "order" FROM "Pokemon" WHERE name ='typhlosion')
            AND "order" < 99999
    UPDATE "Pokemon" SET "order" = (SELECT "order" FROM "Pokemon" WHERE name ='typhlosion') +1  
        WHERE name ='typhlosion-hisui';

-- 'sneasler'

    -- UPDATE "Pokemon" SET "order" = 903 WHERE name ='sneasler';
    -- UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;

-- enamorus-incarnate
    UPDATE "Pokemon" SET "order" = "order" + 1 
        WHERE "order" > (SELECT "order" FROM "Pokemon" WHERE name ='enamorus');
        AND "order" < 99999
    UPDATE "Pokemon" SET "order" = (SELECT "order" FROM "Pokemon" WHERE name ='enamorus') +1  
        WHERE name ='enamorus-incarnate';


-- oinkologne-female
    UPDATE "Pokemon" SET "order" = "order" + 1 
        WHERE "order" > (SELECT "order" FROM "Pokemon" WHERE name ='oinkologne');
        AND "order" < 99999
    UPDATE "Pokemon" SET "order" = (SELECT "order" FROM "Pokemon" WHERE name ='oinkologne') +1  
        WHERE name ='oinkologne-female';

-- tauros-paldea-blaze-breed
    UPDATE "Pokemon" SET "order" = "order" + 1 
        WHERE "order" > (SELECT "order" FROM "Pokemon" WHERE name ='tauros');
        AND "order" < 99999
    UPDATE "Pokemon" SET "order" = (SELECT "order" FROM "Pokemon" WHERE name ='tauros') +1  
        WHERE name ='tauros-paldea-blaze-breed';


-- tauros-paldea-blaze-breed
    UPDATE "Pokemon" SET "order" = "order" + 1 
        WHERE "order" > (SELECT "order" FROM "Pokemon" WHERE name ='lilligant');
        AND "order" < 99999
    UPDATE "Pokemon" SET "order" = (SELECT "order" FROM "Pokemon" WHERE name ='lilligant') +1  
        WHERE name ='lilligant';


UPDATE "Pokemon" SET "order" = 194 WHERE name ='wooper-paldea';
UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;

UPDATE "Pokemon" SET "order" = 571 WHERE name ='zoroark-hisui';
UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;

UPDATE "Pokemon" SET "order" = 10007 WHERE name ='koraidon-sprinting-build';
UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;

UPDATE "Pokemon" SET "order" = 10008 WHERE name ='miraidon-drive-mode';
UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;

UPDATE "Pokemon" SET "order" = 10008 WHERE name ='miraidon-glide-mode';
UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;

UPDATE "Pokemon" SET "order" = 964 WHERE name ='palafin-hero';
UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;

UPDATE "Pokemon" SET "order" = 978 WHERE name ='tatsugiri-stretchy';
UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;

UPDATE "Pokemon" SET "order" = 931 WHERE name ='squawkabilly-yellow-plumage';
UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;

UPDATE "Pokemon" SET "order" = 10007 WHERE name ='koraidon-swimming-build';
UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;

UPDATE "Pokemon" SET "order" = 99999 WHERE name ='ursaluna-bloodmoon';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='gimmighoul-roaming';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='venusaur-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='blastoise-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='dialga-origin';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='overqwil';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='drednaw-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='ursaluna';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='meowth-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='wyrdeer';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='sneasel-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='butterfree-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='qwilfish-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='sliggoo-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='decidueye-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='gengar-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='lapras-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='voltorb-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='inteleon-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='kingler-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='electrode-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='melmetal-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 905 WHERE name ='enamorus-therian';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='basculin-white-striped';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='zorua-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='goodra-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='snorlax-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='machamp-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='arcanine-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='growlithe-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='samurott-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='pikachu-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='orbeetle-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='dudunsparce-three-segment';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='kleavor';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='basculegion-male';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='coalossal-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='basculegion-female';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='tauros-paldea-aqua-breed';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='braviary-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='avalugg-hisui';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='ogerpon-cornerstone-mask';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='squawkabilly-blue-plumage';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='koraidon-gliding-build';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='miraidon-aquatic-mode';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='maushold-family-of-three';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='ogerpon-wellspring-mask';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='koraidon-limited-build';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='squawkabilly-white-plumage';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='ogerpon-hearthflame-mask';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='terapagos-stellar';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='terapagos-terastal';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='flapple-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='grimmsnarl-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='centiskorch-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='sandaconda-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='alcremie-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='urshifu-single-strike-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='toxtricity-low-key-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='urshifu-rapid-strike-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='rillaboom-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='cinderace-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='appletun-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='hatterene-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='toxtricity-amped-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='copperajah-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='palkia-origin';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='tauros-paldea-combat-breed';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='miraidon-low-power-mode';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 978 WHERE name ='tatsugiri-droopy';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='eevee-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='garbodor-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='corviknight-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='charizard-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
UPDATE "Pokemon" SET "order" = 99999 WHERE name ='duraludon-gmax';

UPDATE "Pokemon" SET "order" = "order" + 1 where "order" >= 254; and "order" < 99999;
