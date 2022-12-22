import React, { FC } from 'react';
import {
  Typography,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid
} from '@mui/material';
import { StakingOptions } from '../SimpleStaker';
import { StakingBalances } from '../../../simple-staking/actions';
import FormatBalance from '../../../components/FormatBalance';
import { TableContainer } from '../../../components/Tables/Table.styled';
import { BN } from '@polkadot/util';

const optionText = (enabled: boolean, title: string, body: JSX.Element | string) => {
  return (
    <Grid item xs={12} sx={{ m: 2 }}>
      <Typography sx={{ fontWeight: enabled ? 600 : 400 }} variant='h3'>{title}</Typography>
      <Typography sx={{ fontWeight: enabled ? 600 : 400 }} variant='body2'>{body}</Typography>
    </Grid>
  );
};

const styledBalance = (value: string | BN, weight = 600) => {
  return (
    <Typography sx={{ color: 'black', fontWeight: weight}} variant='body3'>
      <FormatBalance value={value} />
    </Typography>
  );
}

type Props = {
  balances: StakingBalances;
  selected?: string;
  onSelect: (option: StakingOptions) => void;
};

const ActionSelection: FC<Props> = ({ balances, onSelect, selected }) => {
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(evt.target.value as StakingOptions);
  };

  return (
    <>
      <Stack spacing={4}>
        <Typography variant='h2' sx={{fontSize: {xs: '22px', md: '30px'}, textAlign: {xs: 'center', md: 'left'}}}>Select Option</Typography>
        <FormControl>
          <RadioGroup
            value={selected ?? ''}
            aria-labelledby='staking-options'
            defaultValue={balances.available.eqn(0) ? (balances.onlyStash ? '' : 'change') : 'stake'}
            name='staking-options'
            onChange={handleChange}
          >
            <FormControlLabel
              labelPlacement='end'
              value='stake'
              control={<Radio disabled={balances.available.eqn(0)} />}
              label={
                balances.staked.eqn(0)
                  ? optionText(true, 'Stake', <>This account has no funds staked. You can stake up to {styledBalance(balances.available)}. </>)
                  : balances.available.eqn(0)
                    ? optionText(false, 'Stake', <>This account has all its funds staked. </>)
                    : optionText(true, 'Stake', <>You can stake up to {styledBalance(balances.available)} more. </>)
              }
            />
            <FormControlLabel
              labelPlacement='end'
              value='change'
              control={<Radio disabled={balances.staked.eqn(0) || balances.onlyStash} />}
              label={
                balances.staked.eqn(0)
                  ? optionText(false, 'Change Validators', <>This option is not available until you start staking. </>)
                  : ( balances.onlyStash
                      ? optionText(false, 'Change Validators', <>You have {styledBalance(balances.staked, 400)} staked. Use your controller account to change validators. </>)
                      : optionText(true, 'Change Validators', <>You have {styledBalance(balances.staked)} staked. </>)
                    )
              }
            />
            <FormControlLabel
              labelPlacement='end'
              value='unstake'
              control={<Radio disabled={balances.staked.eqn(0) || balances.onlyStash} />}
              label={
                balances.staked.eqn(0)
                  ? optionText(false, 'Unstake', <>This account has no funds to be unstaked. </>)
                  : ( balances.onlyStash
                      ? optionText(false, 'Unstake', <> You can unstake up to {styledBalance(balances.staked, 400)}. Use your controller account to unstake. </>)
                      : optionText(true, 'Unstake', <> You can unstake up to {styledBalance(balances.staked)}. </>)
                    )
              }
            />
            <FormControlLabel
              labelPlacement='end'
              value='redeem'
              control={<Radio disabled={balances.redeemable.eqn(0) || balances.onlyStash} />}
              label={
                balances.redeemable.eqn(0)
                  ? optionText(false, 'Redeem', <>This account has no funds to be redeemed. </>)
                  : ( balances.onlyStash
                      ? optionText(false, 'Redeem', <>You can redeem {styledBalance(balances.redeemable, 400)}. Use your controller account to redeem. </>)
                      : optionText(true, 'Redeem', <>You can redeem {styledBalance(balances.redeemable)}. </>)
                    )
              }
            />
          </RadioGroup>
        </FormControl>
        { balances.unlocking.length > 0 &&
          <Stack spacing={2}>
            <Typography variant='h3'>Unstaked funds</Typography>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell>Available to redeem in</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {balances.unlocking.map(([value, days]) => (
                    <TableRow>
                      <TableCell>
                        <Typography>
                          <FormatBalance value={value} />
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{days} day{(days > 1) && 's'}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        }
      </Stack>
    </>
  );
};

export default ActionSelection;
